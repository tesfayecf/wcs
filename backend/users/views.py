from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from users.models import User
from users.serializers import *

######################
### AUTHENTICATION ###
######################

class LoginView(APIView):
    """
    View for handling user login.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for logging in.
    """

    def post(self, request):
        """
        Handles POST requests for logging in.

        Parameters:
        - request: The HTTP request object.

        Returns:
        - Response: HTTP response with user data if login is successful.
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user:
                login(request, user)
                return Response(UserSerializer(user).data)
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """
    View for handling user logout.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for logging out.
    """

    def post(self, request):
        """
        Handles POST requests for logging out.

        Parameters:
        - request: The HTTP request object.

        Returns:
        - Response: HTTP response if logout is successful.
        """
        logout(request)
        return Response({"detail": "Logged out"}, status=status.HTTP_200_OK)

class RecoverView(APIView):
    """
    Custom view for recovering user passwords.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for recovering user passwords.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for recovering user passwords.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response for password recovery.
        """
        serializer = RecoverSerializer(data=request.data)

        if serializer.is_valid():
            user = User.objects.filter(
                email=serializer.validated_data['email']
            ).first()
            if user:
                # TODO:
                # Store recovery token in database
                # Send token with recovery email
                # user.send_password_recovery_email() // TODO
                return Response({"detail": "Password recovery email has been sent."}, status=status.HTTP_200_OK)
            return Response({"detail": "User with the provided email does not exist."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"detail": "Email is required for password recovery."}, status=status.HTTP_400_BAD_REQUEST)

class ResetView(APIView):
    """
    Custom view for resetting user passwords.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for resetting user passwords.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for resetting user passwords.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response for password reset.
        """
        serializer = ResetSerializer(data=request.data)

        if serializer.is_valid():
            user = User.objects.filter(
                id=serializer.validated_data['uid']
            ).first()
            if user:
                if serializer.validated_data['new_password'] == serializer.validated_data['confirm_password']:
                    user.set_password(serializer.validated_data['new_password'])
                    user.save()
                    update_session_auth_hash(request, user)
                    return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
                return Response({"detail": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"detail": "User with the provided id does not exist."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"detail": "All fields are required for password reset."}, status=status.HTTP_400_BAD_REQUEST)

class SignupView(APIView):
    """
    Custom view for signing up new users.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for registering new users.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for registering new users.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response for user registration.
        """
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            if serializer.validated_data['password'] == serializer.validated_data['confirm_password']:
                if User.objects.filter(
                    email=serializer.validated_data['email']
                ).exists():
                    return Response({"detail": "Email address is already in use."}, status=status.HTTP_400_BAD_REQUEST)
                user = User.objects.create(
                    email=serializer.validated_data['email'],
                    first_name=serializer.validated_data['first_name'],
                    last_name=serializer.validated_data['last_name'],
                    password=serializer.validated_data['password'],
                )
                return Response({"detail": "User registered successfully."}, status=status.HTTP_200_OK)
            return Response({"detail": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "All fields are required for user registration."}, status=status.HTTP_400_BAD_REQUEST)

###############
### SESSION ###
###############

class RefreshSessionView(APIView):
    """
    View for refreshing the user session.

    Methods:
    - post: Handles POST requests for refreshing the session.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for refreshing the session.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response for session refresh.
        """
        if request.user.is_authenticated:
            # Update the user session
            update_session_auth_hash(request, request.user)
        return Response({"detail": "User is authenticated."}, status=status.HTTP_200_OK)

class VerifySessionView(APIView):
    """
    View for verifying that the user session is valid.

    If the session is not valid, logs out the user.

    Methods:
    - post: Handles POST requests for verifying the session.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for verifying the session.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response for session verification.
        """
        if not request.user.is_authenticated:
            logout(request)
            return Response({"detail": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"detail": "User is authenticated."}, status=status.HTTP_200_OK)

############
### USER ###
############

class GetUserInfoView(APIView):
    """
    View for retrieving the currently authenticated user.

    Methods:
    - post: Handles POST requests for retrieving the user.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for retrieving the currently authenticated user.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response with user data.
        """
        serializer = UserInfoSerializer(request.user)
        return Response(serializer.data)

class UpdateUserInfoView(APIView):
    """
    View for updating the currently authenticated user.

    Methods:
    - post: Handles POST requests for updating the user.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for updating the currently authenticated user.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response with user data.
        """
        serializer = UpdateUserSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

class GetUsersView(APIView):
    """
    View for retrieving all users.

    Methods:
    - get: Handles GET requests for retrieving all users.
    """

    def get(self, request, *args, **kwargs):
        """
        Handles GET requests for retrieving all users.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response with user data.
        """
        if not request.user.is_superuser:
            return Response({"detail": "Only superusers can access this resource."}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.all()
        serializer = UserInfoSerializer(users, many=True)
        return Response(serializer.data)
    
class CreateUserView(APIView):
    """
    View for creating a new user.

    Methods:
    - post: Handles POST requests for creating a new user.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for creating a new user.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response with user data.
        """
        if not request.user.is_superuser:
            return Response({"detail": "Only superusers can access this resource."}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteUserView(APIView):
    """
    View for deleting a user.

    Methods:
    - delete: Handles DELETE requests for deleting a user.
    """

    def delete(self, request, *args, **kwargs):
        """
        Handles DELETE requests for deleting a user.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response with user data.
        """
        if not request.user.is_superuser:
            return Response({"detail": "Only superusers can access this resource."}, status=status.HTTP_403_FORBIDDEN)
        user = User.objects.get(pk=kwargs['pk'])
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)