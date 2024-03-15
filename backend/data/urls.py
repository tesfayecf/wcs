from django.urls import path
from .views import *

urlpatterns = [
    # summary
    path('summary/', GetSummaryView.as_view()),

    # group
    path('groups/', GetGroupsView.as_view()),
    path('create-group/', CreateGroupView.as_view()),
    path('edit-group/', EditGroupView.as_view()),
    path('delete-group/', DeleteGroupView.as_view()),
    # path('group-stats/', GetGroupStatsView.as_view()),

    # tank
    path('tanks/', GetTanksView.as_view()),
    path('create-tank/', CreateTankView.as_view()),
    path('edit-tank/', EditTankView.as_view()),
    path('delete-tank/', DeleteTankView.as_view()),
    # path('tank-stats/', GetTankStatsView.as_view()),

    # sensor
    path('sensor/', GetSensorView.as_view()),
    path('create-sensor/', CreateSensorView.as_view()),
    path('edit-sensor/', EditSensorView.as_view()),
    path('delete-sensor/', DeleteSensorView.as_view()),
    # path('tank-sensor-data/', GetTankSensorDataView.as_view()),
]
