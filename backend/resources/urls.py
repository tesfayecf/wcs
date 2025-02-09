from django.urls import path
from .views import *

urlpatterns = [
    # GROUP
    path('create-group/', CreateGroupView.as_view()),
    path('get-group/', GetGroupView.as_view()),
    path('get-groups/', GetGroupsView.as_view()),
    path('update-group/', UpdateGroupView.as_view()),
    path('delete-group/', DeleteGroupView.as_view()),
    path('group-info/', GetGroupInfoView.as_view()),
    path('group-metrics/', GetGroupMetricsView.as_view()),

    # # TANK
    path('create-tank/', CreateTankView.as_view()),
    path('get-tank/', GetTankView.as_view()),
    path('get-tanks/', GetTanksView.as_view()),
    path('update-tank/', UpdateTankView.as_view()),
    path('delete-tank/', DeleteTankView.as_view()),
    # path('tanks-info/', GetTanksInfoView.as_view()),
    # path('tank-metrics/', GetTankMetricsView.as_view()),

    # # SENSOR
    path('create-sensor/', CreateSensorView.as_view()),
    path('get-sensor/', GetSensorView.as_view()),
    path('get-sensors/', GetSensorsView.as_view()),
    path('update-sensor/', UpdateSensorView.as_view()),
    path('delete-sensor/', DeleteSensorView.as_view()),

    # # INFO
    # path('stats/', GetStatsView.as_view()),
    # path('summary/', GetSummaryView.as_view()),
]
