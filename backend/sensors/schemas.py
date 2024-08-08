from pydantic import BaseModel
from datetime import datetime
from enum import Enum

######################
### SENOR READINGS ###
######################

class SensorReadingSchema(BaseModel):
    distance: float
    time: int

    class Config:
        from_attributes = True

class GetSensorReadingsSchema(BaseModel):
    sensor_id: str
    timeframe: int
    period: str
    start_time: datetime
    end_time: datetime 

class GetLastSensorReadingSchema(BaseModel):
    sensor_id: str
    
class GetSensorFlowSchema(BaseModel):
    sensor_id: str
    timeframe: int
    period: str
    start_time: datetime
    end_time: datetime