from django.urls import path
from .views import tank, tank_group
from .views import TanksViews, TankGroupsView, CreateTankView, CreateTankGroupView
urlpatterns = [

    # # USER MANAGMENT
    # path("login/", views.login_user, name="login"),
    # path("logout/", views.logout_user, name="logout"),


    # API
    path('tanks/', TanksViews.as_view()),
    path("tank/<int:tankId>", tank),
    path('create-tank/', CreateTankView.as_view()),

    path('tank-groups/', TankGroupsView.as_view()),
    path('tank-group/<int:tankGroupId>', tank_group),
    path('create-tank-group/', CreateTankGroupView.as_view()),

]
