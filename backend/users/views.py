from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from djoser.social.views import ProviderAuthView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from users.models import User

#####################
### PROVIDER AUTH ###
#####################

class CustomProviderAuthView(ProviderAuthView):
    """
    Custom view for handling social authentication and setting cookies for access and refresh tokens.

    Inherits from: djoser.social.views.ProviderAuthView

    Methods:
    - post: Override the post method to set cookies for access and refresh tokens.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for social authentication.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response with cookies set for access and refresh tokens.
        """
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response

######################
### AUTHENTICATION ###
######################

class CustomTokenLoginView(TokenObtainPairView):
    """
    Custom view for obtaining JWT tokens and setting cookies for access and refresh tokens.

    Inherits from: rest_framework_simplejwt.views.TokenObtainPairView

    Methods:
    - post: Override the post method to set cookies for access and refresh tokens.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for obtaining JWT tokens.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response with cookies set for access and refresh tokens.
        """
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response

class CustomTokenLogoutView(APIView):
    """
    Custom view for logging out and clearing cookies for access and refresh tokens.

    Inherits from: rest_framework.views.APIView

    Methods:
    - post: Handles POST requests for logging out and clearing cookies.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for logging out and clearing cookies.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response with cookies cleared.
        """
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response

class CustomTokenRecoverView(APIView):
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
        email = request.data.get('email')

        # Implement password recovery logic here
        # Example: Send email to user with password reset link

        # For demonstration purposes, let's assume the password recovery was successful
        return Response(status=status.HTTP_404_NOT_FOUND)

class CustomTokenResetView(APIView):
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
        old_password = request.data.get('oldPassword')
        new_password = request.data.get('password')
        re_password = request.data.get('rePassword')

        # Implement password reset logic here
        # Example: Validate old password, update password, and respond accordingly

        # For demonstration purposes, let's assume the password reset was successful
        return Response(status=status.HTTP_404_NOT_FOUND)

class CustomTokenSignupView(APIView):
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
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        re_password = request.data.get('confirmPassword')

        # Validation: Check if required fields are provided
        if not (name and email and password and re_password):
            return Response({'detail': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validation: Check if passwords match
        if password != re_password:
            return Response({'detail': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validation: Check if the email is unique
        if User.objects.filter(email=email).exists():
            return Response({'detail': 'Email address is already in use.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new user
        User.objects.create(
            name=name,
            email=email,
            password=password,
        )

        return Response({'detail': 'User registered successfully.'}, status=status.HTTP_200_OK)

#############
### TOKEN ###
#############

class CustomTokenVerifyView(TokenVerifyView):
    """
    Custom view for verifying JWT tokens using cookies.

    Inherits from: rest_framework_simplejwt.views.TokenVerifyView

    Methods:
    - post: Override the post method to use the access token from cookies for verification.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for verifying JWT tokens.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response from token verification.
        """
        access_token = request.COOKIES.get('access')

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)

class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom view for refreshing JWT tokens and updating the access token in cookies.

    Inherits from: rest_framework_simplejwt.views.TokenRefreshView

    Methods:
    - post: Override the post method to update the access token in cookies after refresh.
    """

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests for refreshing JWT tokens.

        Parameters:
        - request: The HTTP request object.
        - args: Additional positional arguments.
        - kwargs: Additional keyword arguments.

        Returns:
        - Response: HTTP response with updated access token in cookies.
        """
        refresh_token = request.COOKIES.get('refresh')

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response

############
### USER ###
############

class GetUserView(APIView):
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
        user = request.user
        data = {
            'id': user.id,
            'email': user.email,
            'name': user.first_name,
        }
        if user.is_staff:
            data["role"] = "staff"
        if user.is_superuser:
            data["role"] = "admin"
        return Response(data)