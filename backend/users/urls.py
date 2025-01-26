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
    # path('get-user/', GetUserView.as_view()),
    # path('get-users/', GetUsersView.as_view()),
    path('get-users/', GetUsersInfoView.as_view()),
    path('update-user/', UpdateUserInfoView.as_view()),
    path('delete-user/', DeleteUserView.as_view()),

    path('get-user-info/', GetUserInfoView.as_view()),
    # path('get-user-metrics/', GetUserMetricsView.as_view()),

    # PERMISSION
    # path('create-permission/', CreatePermissionView.as_view()),
    # path('get-permission/', GetPermissionView.as_view()),
    # path('get-permissions/', GetPermissionsView.as_view()),
    # path('update-permission/', UpdatePermissionView.as_view()),
    # path('delete-permission/', DeletePermissionView.as_view()),

    # path('create-user-permission/', CreateUserPermissionView.as_view()),
    # path('get-user-permission/', GetUserPermissionView.as_view()),
    # path('get-user-permissions/', GetUserPermissionsView.as_view()),
    # path('update-user-permission/', UpdateUserPermissionView.as_view()),
    # path('delete-user-permission/', DeleteUserPermissionView.as_view()),
]