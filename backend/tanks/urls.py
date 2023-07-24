from django.urls import path
from .views import *

urlpatterns = [
    # API: /api/...
    path('tank-groups/', GetTankGroupsView.as_view()),
    path('create-tank-group/', CreateTankGroupView.as_view()),
    path('edit-tank-group/', EditTankGroupView.as_view()),
    path('delete-tank-group/', DeleteTankGroupView.as_view()),
    path('tank-group-tanks/', GetTankGroupTanks.as_view()),
    path('tank-groups-stats/', GetTankGroupStatsView.as_view()),

    path('tanks/', GetTankView.as_view()),
    path('create-tank/', CreateTankView.as_view()),
    path('edit-tank/', EditTankView.as_view()),
    path('delete-tank/', DeleteTankView.as_view()),
    path('tank-stats/', GetTankStatsView.as_view()),
    path('tank-sensors/', GetTankSensorsView.as_view()),
    
]
