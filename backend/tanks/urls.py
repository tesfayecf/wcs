from django.urls import path
from .views import tank
from .views import *
urlpatterns = [

    # API: /api/...
    path('create-tank/', CreateTankView.as_view()),
    path('edit-tank', EditTankView.as_view()),
    path('delete-tank', DeleteTankView.as_view()),
    path('tanks/', GetUserTanksView.as_view()),
    path('tanks-stats', GetTankStatsView.as_view()),
    path('tanks-sensors', GetTankSensorsView.as_view()),
    

    path('create-tank-group/', CreateTankGroupView.as_view()),
    path('edit-tank-group/', EditTankGroupView.as_view()),
    path('delete-tank-group/', DeleteTankGroupView.as_view()),
    path('tank-groups/', GetUserTankGroupsView.as_view()),
    path('tank-groups-stats', GetTankGroupStatsView.as_view())

]
