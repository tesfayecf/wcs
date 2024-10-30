from django.core.cache import cache
from django.forms.models import model_to_dict
from django.core.exceptions import ValidationError
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .views import GenericModelView

CACHE_TIMEOUT = 3600

class GenericModelView(APIView):
    model = None  # The model class to use
    schema_class = None  # Schema class for request data processing
    cache_key_prefix = ""  # Prefix for cache keys
    
    def get_cache_key(self, instance_id):
        return f"{self.cache_key_prefix}_{instance_id}"
    
    def get_object(self, object_id, user):
        """Retrieve the object from cache or database."""
        cache_key = self.get_cache_key(object_id)
        
        # Attempt to retrieve data from cache
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data

        # Retrieve object from database if not in cache
        obj = self.model.objects.filter(pk=object_id, user=user).first()
        if obj:
            cache.set(cache_key, obj, timeout=CACHE_TIMEOUT)
            return obj

        # Return None if the object is not found in both cache and database
        return None

    def remove_object_cache(self, object_id):
        """Remove cached data for a specific object."""
        cache_key = self.get_cache_key(object_id)
        cache.delete(cache_key)
    
    def get_schema(self, request):
        """Get the schema instance from request data."""
        if self.schema_class:
            return self.schema_class(**request.data)
        raise NotImplementedError("Subclasses must provide a schema_class.")

    def post(self, request, *args, **kwargs):
        """Method to be implemented in subclasses for specific actions."""
        raise NotImplementedError("Subclasses must implement this method.")

### GET ###
class GetObjectsView(GenericModelView):
    def post(self, request, *args, **kwargs):
        try:
            # Deserialize request data
            schema = self.get_schema(request)
            
            # Validate schema
            schema.is_valid(raise_exception=True)
            
            # Retrieve and serialize objects
            objects = self.model.objects.filter(user=request.user)
            objects_json = [self.schema_class(**model_to_dict(obj)).model_dump() for obj in objects]
            
            return Response(objects_json, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error retrieving objects: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### CREATE ###
class CreateObjectView(GenericModelView):
    def post(self, request, *args, **kwargs):
        try:
            # Deserialize request data
            schema = self.get_schema(request)
            
            # Validate schema
            schema.is_valid(raise_exception=True)
            
            # Extract validated data
            validated_data = schema.validated_data
            
            # Check if an object with the same name already exists
            if self.model.objects.filter(name=validated_data['name'], user=request.user).exists():
                return Response({'Bad Request': 'Object with the same name already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create and save a new object
            obj = self.model(**validated_data, user=request.user)
            obj.save()
            
            # Cache the data for future requests
            cache_key = self.get_cache_key(obj.id)
            cache.set(cache_key, obj, timeout=CACHE_TIMEOUT)
            
            # Serialize the created object
            obj_data = model_to_dict(obj)
            obj_schema = self.schema_class(**obj_data)
            obj_json = obj_schema.model_dump()
            
            return Response(obj_json, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error creating object: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### EDIT ###
class EditObjectView(GenericModelView):
    def post(self, request, *args, **kwargs):
        try:
            # Deserialize request data
            schema = self.get_schema(request)
            
            # Validate schema
            schema.is_valid(raise_exception=True)
            
            # Extract validated data
            validated_data = schema.validated_data
            
            # Remove cache for this object
            self.remove_object_cache(validated_data['id'])

            # Retrieve and update the object
            obj = self.get_object(validated_data['id'], request.user)
            if not obj:
                return Response({'Bad Request': 'Object not found'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Update object fields
            for attr, value in validated_data.items():
                setattr(obj, attr, value)
            obj.save()
            
            # Serialize the updated object
            obj_data = model_to_dict(obj)
            obj_schema = self.schema_class(**obj_data)
            obj_json = obj_schema.model_dump()
            
            # Cache the updated object
            cache_key = self.get_cache_key(obj.id)
            cache.set(cache_key, obj, timeout=CACHE_TIMEOUT)
            
            return Response(obj_json, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error editing object: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

### DELETE ###
class DeleteObjectView(GenericModelView):
    def post(self, request, *args, **kwargs):
        try:
            # Deserialize request data
            schema = self.get_schema(request)
            
            # Validate schema
            schema.is_valid(raise_exception=True)
            
            # Extract validated data
            validated_data = schema.validated_data
            
            # Retrieve and delete the object
            obj = self.get_object(validated_data['id'], request.user)
            if not obj:
                return Response({'Bad Request': 'Object not found'}, status=status.HTTP_400_BAD_REQUEST)
            
            obj.delete()
            
            # Remove cache for the object
            self.remove_object_cache(validated_data['id'])
            
            return Response({}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error deleting object: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BaseModelAPIView(APIView):
    model = None
    serializer_class = None
    queryset = None
    cache_timeout = 60 * 15  # 15 minutes default

    @classmethod
    def get_extra_actions(cls):
        return []

    @method_decorator(cache_page(cache_timeout))
    @method_decorator(vary_on_cookie)
    def get(self, request, pk=None):
        if pk:
            return self.get_single_item(pk)
        return self.get_item_list()

    def get_single_item(self, pk):
        try:
            item = self.get_queryset().get(pk=pk)
            serializer = self.serializer_class(item)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get_item_list(self):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.clear()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            item = self.get_queryset().get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.clear()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            item = self.get_queryset().get(pk=pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        item.delete()
        cache.clear()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        if self.queryset is None:
            if self.model:
                return self.model.objects.all()
            else:
                raise ValueError("Queryset or Model must be defined")
        return self.queryset