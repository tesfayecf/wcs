from pydantic import BaseModel
from datetime import datetime
from enum import Enum

#####################
### SENOR READING ###
#####################

class SensorReadingSchema(BaseModel):
    distance: float
    time: datetime

    class Config:
        from_attributes = True

class GetSensorReadingsSchema(BaseModel):
    id: int
    timeframe: int
    period: str
    start_time: datetime
    end_time: datetime
    

class GetLastSensorReadingSchema(BaseModel):
    id: int