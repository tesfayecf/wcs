import pytest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from datetime import datetime
from .serializers import (
    LoginSerializer, RecoverSerializer, ResetSerializer, 
    SignupSerializer, UserSerializer, CreateUserSerializer,
    UpdateUserSerializer, DeleteUserSerializer
)

User = get_user_model()

############
# Fixtures #
############

@pytest.fixture
def user_data():
    return {
        'email': 'test@example.com',
        'first_name': 'Test',
        'last_name': 'User',
        'password': 'securepassword123'
    }

@pytest.fixture
def user(user_data):
    return User.objects.create_user(**user_data)

@pytest.fixture
def superuser_data():
    return {
        'email': 'admin@example.com',
        'first_name': 'Admin',
        'last_name': 'User',
        'password': 'adminpassword123',
        'is_staff': True,
        'is_superuser': True
    }

@pytest.fixture
def superuser(superuser_data):
    return User.objects.create_superuser(**superuser_data)

################
# Model Tests #
################

@pytest.mark.django_db
class TestUserModel:
    
    def test_create_user(self, user_data):
        """Test creating a regular user"""
        user = User.objects.create_user(**user_data)
        assert user.email == user_data['email']
        assert user.first_name == user_data['first_name']
        assert user.last_name == user_data['last_name']
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False
        assert user.check_password(user_data['password'])

    def test_create_superuser(self, superuser_data):
        """Test creating a superuser"""
        user = User.objects.create_superuser(**superuser_data)
        assert user.email == superuser_data['email']
        assert user.is_active is True
        assert user.is_staff is True
        assert user.is_superuser is True
        assert user.check_password(superuser_data['password'])

    def test_user_str_representation(self, user):
        """Test string representation of user"""
        assert str(user) == user.email

    def test_user_email_unique(self, user_data):
        """Test that email must be unique"""
        User.objects.create_user(**user_data)
        with pytest.raises(IntegrityError):
            User.objects.create_user(**user_data)

    def test_create_user_without_email(self, user_data):
        """Test creating a user without email fails"""
        with pytest.raises(ValueError):
            User.objects.create_user(
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                email='',
                password='test123'
            )

    def test_create_user_with_invalid_email(self):
        """Test creating a user with invalid email"""
        with pytest.raises(ValidationError):
            user = User(
                email='invalid-email',
                password='test123'
            )
            user.full_clean()

    def test_user_timestamps(self, user):
        """Test that timestamps are set correctly"""
        assert isinstance(user.created_at, datetime)
        assert isinstance(user.edited_at, datetime)

#####################
# Serializer Tests #
#####################

@pytest.mark.django_db
class TestAuthenticationSerializers:
    
    def test_login_serializer_valid(self):
        """Test login serializer with valid data"""
        data = {
            'email': 'test@example.com',
            'password': 'test123'
        }
        serializer = LoginSerializer(data=data)
        assert serializer.is_valid()
        assert 'password' in serializer.validated_data
        assert serializer.validated_data['password'] == 'test123'

    def test_login_serializer_invalid(self):
        """Test login serializer with invalid data"""
        data = {
            'email': 'invalid-email',
            'password': ''
        }
        serializer = LoginSerializer(data=data)
        assert not serializer.is_valid()

    def test_recover_serializer(self):
        """Test password recovery serializer"""
        data = {'email': 'test@example.com'}
        serializer = RecoverSerializer(data=data)
        assert serializer.is_valid()

        data = {'email': 'invalid-email'}
        serializer = RecoverSerializer(data=data)
        assert not serializer.is_valid()

    def test_reset_serializer(self):
        """Test password reset serializer"""
        data = {
            'uid': 'testuid',
            'token': 'testtoken',
            'password': 'newpassword123',
            're_password': 'newpassword123'
        }
        serializer = ResetSerializer(data=data)
        assert serializer.is_valid()

        # Test password mismatch
        data['re_password'] = 'different'
        serializer = ResetSerializer(data=data)
        assert not serializer.is_valid()

    def test_signup_serializer(self):
        """Test signup serializer"""
        data = {
            'email': 'new@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'test123',
            're_password': 'test123'
        }
        serializer = SignupSerializer(data=data)
        assert serializer.is_valid()

        # Test password mismatch
        data['re_password'] = 'different'
        serializer = SignupSerializer(data=data)
        assert not serializer.is_valid()

@pytest.mark.django_db
class TestUserSerializers:
    
    def test_user_serializer(self, user):
        """Test user serializer"""
        serializer = UserSerializer(user)
        data = serializer.data
        assert data['email'] == user.email
        assert data['first_name'] == user.first_name
        assert data['last_name'] == user.last_name
        assert data['is_active'] == user.is_active
        assert data['is_staff'] == user.is_staff
        assert 'password' not in data

    def test_create_user_serializer(self):
        """Test create user serializer"""
        data = {
            'email': 'new@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'test123',
            'is_staff': True,
            'is_superuser': False
        }
        serializer = CreateUserSerializer(data=data)
        assert serializer.is_valid()

    def test_update_user_serializer(self, user):
        """Test update user serializer"""
        data = {
            'id': user.id,
            'first_name': 'Updated',
            'last_name': 'Name',
            'is_active': False
        }
        serializer = UpdateUserSerializer(data=data)
        assert serializer.is_valid()

    def test_delete_user_serializer(self, user):
        """Test delete user serializer"""
        data = {'id': user.id}
        serializer = DeleteUserSerializer(data=data)
        assert serializer.is_valid()

####################
# Integration Tests #
####################

@pytest.mark.django_db
class TestUserAuthentication:
    
    def test_user_login(self, user, user_data):
        """Test user can login with correct credentials"""
        assert user.check_password(user_data['password'])
        
    def test_user_login_wrong_password(self, user):
        """Test user cannot login with wrong password"""
        assert not user.check_password('wrongpassword')

    def test_inactive_user(self, user):
        """Test inactive user cannot authenticate"""
        user.is_active = False
        user.save()
        assert not user.is_active

    def test_superuser_privileges(self, superuser):
        """Test superuser has all privileges"""
        assert superuser.is_superuser
        assert superuser.is_staff
        assert superuser.has_perm('auth.add_user')
        assert superuser.has_perm('auth.change_user')
        assert superuser.has_perm('auth.delete_user')

    def test_regular_user_privileges(self, user):
        """Test regular user has limited privileges"""
        assert not user.is_superuser
        assert not user.is_staff
        assert not user.has_perm('auth.add_user')
        assert not user.has_perm('auth.change_user')
        assert not user.has_perm('auth.delete_user')