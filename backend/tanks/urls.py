from django.urls import path
from .views import tank
from .views import TankGroupsView, CreateTankView, CreateTankGroupView
urlpatterns = [

    # API
    # path('tanks/', TanksViews.as_view()),
    path("tank/<int:tankId>", tank),
    path('create-tank/', CreateTankView.as_view()),

    path('create-tank-group/', CreateTankGroupView.as_view()),
    path('tank-groups/', TankGroupsView.as_view()),
    # path('tank-group/<int:tankGroupId>', tank_group),

]
