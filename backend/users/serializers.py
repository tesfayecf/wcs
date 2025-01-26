from rest_framework import serializers
from .models import User
######################
### AUTHENTICATION ###
######################

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

class RecoverSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)
    re_password = serializers.CharField(write_only=True)

class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField(write_only=True)
    re_password = serializers.CharField(write_only=True)

###############
### SESSION ###
###############

##############
### USERS ###
##############

class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    edited_at = serializers.DateTimeField()
    created_at = serializers.DateTimeField()
    is_active = serializers.BooleanField()
    is_staff = serializers.BooleanField()
    is_superuser = serializers.BaseSerializer()

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'email': instance.email,
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'edited_at': instance.edited_at,
            'created_at': instance.created_at,
            'is_active': instance.is_active,
            'is_staff': instance.is_staff,
        }

    class Meta:
        model = User
        fields = '__all__'

class CreateUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField()
    is_staff = serializers.BooleanField(default=False)
    is_superuser = serializers.BooleanField(default=False)

class UpdateUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    is_active = serializers.BooleanField(required=False)
    is_staff = serializers.BooleanField(required=False)
    is_supseruser = serializers.BooleanField(required=False)

class DeleteUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()