
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

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

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'created_at', 'is_active', 'is_staff', 'is_superuser']

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']