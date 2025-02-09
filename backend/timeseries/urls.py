from django.urls import path
from .views import *

urlpatterns = [
    # # Measures
    # path('create-measure/', CreateMeasureView.as_view()),
    # path('get-measure/', GetMeasureView.as_view()),
    # path('get-measures/', GetMeasuresView.as_view()),
    # path('update-measure/', UpdateMeasureView.as_view()),
    # path('delete-measure/', DeleteMeasureView.as_view()),
    
    # # Channels
    # path('create-channel/', CreateChannelView.as_view()),
    # path('get-channel/', GetChannelView.as_view()),
    # path('get-channels/', GetChannelsView.as_view()),
    # path('update-channel/', UpdateChannelView.as_view()),
    # path('delete-channel/', DeleteChannelView.as_view()),
    
    # # Chunks
    # path('create-chunk/', CreateChunkView.as_view()),
    # path('get-chunk/', GetChunkView.as_view()),
    # path('get-chunks/', GetChunksView.as_view()),
    # path('update-chunk/', UpdateChunkView.as_view()),
    # path('delete-chunk/', DeleteChunkView.as_view()),
    
    # Records
    # path('create-record/', CreateSensorReadingView.as_view()),
    # path('get-record/', GetSensorReadingsView.as_view()),
    path('get-records/', GetRecordsView.as_view()),
    path('get-records-flow/', GetRecordsFlowView.as_view()),
    path('get-records-trend-forecast/', GetRecordsTrendForecastView.as_view()),
    # path('update-record/', UpdateSensorReadingView.as_view()),
    # path('delete-record/', DeleteSensorReadingView.as_view()),
]
