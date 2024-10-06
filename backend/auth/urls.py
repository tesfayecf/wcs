from django.urls import path
from .views import *

urlpatterns = [
    path('login/', CustomTokenLoginView.as_view()),
    path('logout/', CustomTokenLogoutView.as_view()),
    path('reset/', CustomTokenResetView.as_view()),
    path('signup/', CustomTokenSignupView.as_view()),
    
    path('refresh/', CustomTokenRefreshView.as_view()),
    path('verify/', CustomTokenVerifyView.as_view()),
    
    path('user/', UserView.as_view()),
]