from django.urls import path
from .views import *

urlpatterns = [
    # GROUP
    path('create-group/', CreateGroupView.as_view(), name='create-group'), 
    path('get-group/', GetGroupView.as_view(), name='get-group'),
    path('get-groups/', GetGroupsView.as_view(), name='get-groups'),
    path('update-group/', UpdateGroupView.as_view(), name='update-group'),
    path('delete-group/', DeleteGroupView.as_view(), name='delete-group'),
    path('group-info/', GetGroupInfoView.as_view(), name='get-group-info'),
    path('group-metrics/', GetGroupMetricsView.as_view(), name='get-group-metrics'),

    # TANK
    path('create-tank/', CreateTankView.as_view(), name='create-tank'),
    path('get-tank/', GetTankView.as_view(), name='get-tank'),
    path('get-tanks/', GetTanksView.as_view(), name='get-tanks'),
    path('update-tank/', UpdateTankView.as_view(), name='update-tank'),
    path('delete-tank/', DeleteTankView.as_view(), name='delete-tank'),
    # path('tanks-info/', GetTanksInfoView.as_view()),
    # path('tank-metrics/', GetTankMetricsView.as_view()),

    # # SENSOR
    path('create-sensor/', CreateSensorView.as_view(), name='create-sensor'),
    path('get-sensor/', GetSensorView.as_view(), name='get-sensor'),
    path('get-sensors/', GetSensorsView.as_view(), name='get-sensors'),
    path('update-sensor/', UpdateSensorView.as_view(), name='update-sensor'),
    path('delete-sensor/', DeleteSensorView.as_view(), name='delete-sensor'),

    # # INFO
    # path('stats/', GetStatsView.as_view()),
    # path('summary/', GetSummaryView.as_view()),
]