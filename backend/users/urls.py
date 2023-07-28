from django.urls import path, re_path
from .views import *

urlpatterns = [
    path('create/', CustomTokenObtainPairView.as_view()),
    path('refresh/', CustomTokenRefreshView.as_view()),
    path('verify/', CustomTokenVerifyView.as_view()),
    path('logout/', LogoutView.as_view()),
    
    path('user/', UserView.as_view()),
]