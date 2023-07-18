
from django.http import HttpResponse
from .models import Tank, TankGroup

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializer import TankSerializer, TankGroupSerializer, CreateTankSerializer, CreateTankGroupSerializer


class TanksViews(generics.ListAPIView):
    queryset = Tank.objects.all()
    serializer_class = TankSerializer


def tank(request, tankId):
    t_list = Tank.objects.all()
    return HttpResponse(t_list, content_type="application/json")


class CreateTankView(APIView):
    serializer_class = CreateTankSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            capacity = serializer.data.get('capacity'),
            isActive = serializer.data.get('isActive'),
            dimensions = serializer.data.get('dimensions'),
            material = serializer.data.get('material'),
            brand = serializer.data.get('brand'),
            tankGroup = serializer.data.get('tankGroup')

            queryName = Tank.objects.filter(name=name)

            if len(queryName) == 0:
                tank = Tank(
                    name=name,
                    capacity=capacity,
                    isActive=isActive,
                    dimensions=dimensions,
                    material=material,
                    brand=brand,
                    tankGroup=tankGroup,
                )
                tank.save()
                return Response(TankSerializer(tank).data, status=status.HTTP_201_CREATED)
            return Response({'Bad Request': 'Invalid name...'}, status=status.HTTP_302_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class TankGroupsView(generics.ListAPIView):
    queryset = TankGroup.objects.all()
    serializer_class = TankGroupSerializer


def tank_group(request, tankGroupId):
    tg_list = TankGroup.objects.all()
    return HttpResponse(tg_list, content_type="application/json")


class CreateTankGroupView(APIView):

    serializer_class = CreateTankGroupSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name'),
            isActive = serializer.data.get('isActive'),
            location = serializer.data.get('location'),

            queryName = TankGroup.objects.filter(name=name)

            if len(queryName) == 0:
                TankGroup = TankGroup(
                    name=name,
                    isActive=isActive,
                    location=location,
                )
                TankGroup.save()
                return Response(TankGroupSerializer(TankGroup).data, status=status.HTTP_201_CREATED)
            return Response({'Bad Request': 'Invalid name...'}, status=status.HTTP_302_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)