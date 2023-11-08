from django.urls import path, re_path
from .views import *

urlpatterns = [
    path('login/', CustomTokenLoginView.as_view()),
    path('refresh/', CustomTokenRefreshView.as_view()),
    path('verify/', CustomTokenVerifyView.as_view()),
    path('logout/', CustomTokenLogoutView.as_view()),
    
    path('user/', UserView.as_view()),
]