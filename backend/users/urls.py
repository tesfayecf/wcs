from django.urls import path
from .views import *

urlpatterns = [
    # AUTHENTICATION
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('recover/', RecoverView.as_view()),
    path('reset/', ResetView.as_view()),
    path('signup/', SignupView.as_view()),
    
    # SESSION
    path('refresh/', RefreshSessionView.as_view()),
    path('verify/', VerifySessionView.as_view()),
    
    # USER
    path('create-user/', CreateUserView.as_view()),
    path('get-user/', GetUserInfoView.as_view()),
    path('get-users/', GetUsersInfoView.as_view()),
    path('update-user/', UpdateUserInfoView.as_view()),
    path('delete-user/', DeleteUserView.as_view()),
]