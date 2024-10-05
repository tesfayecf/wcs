from django.urls import path
from .views import *

urlpatterns = [
    # GROUP
    path('group/', GetGroupView.as_view()),
    path('groups/', GetGroupsView.as_view()),
    path('create-group/', CreateGroupView.as_view()),
    path('edit-group/', EditGroupView.as_view()),
    path('delete-group/', DeleteGroupView.as_view()),
    path('group-stats/', GetGroupStatsView.as_view()),

    # TANK
    path('tank/', GetTankView.as_view()),
    path('tanks/', GetTanksView.as_view()),
    path('create-tank/', CreateTankView.as_view()),
    path('edit-tank/', EditTankView.as_view()),
    path('delete-tank/', DeleteTankView.as_view()),

    # SENSOR
    path('sensor/', GetSensorView.as_view()),
    path('sensors/', GetSensorsView.as_view()),
    path('create-sensor/', CreateSensorView.as_view()),
    path('edit-sensor/', EditSensorView.as_view()),
    path('delete-sensor/', DeleteSensorView.as_view()),

    # INFO
    path('stats/', GetStatsView.as_view()),
    path('summary/', GetSummaryView.as_view()),
]
