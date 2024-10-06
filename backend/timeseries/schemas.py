from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

#######################
### SENSOR READINGS ###
#######################

class SensorReadingSchema(BaseModel):
    distance: float
    time: datetime  # Changed to datetime for consistency with other schemas

### GET ###
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
    start_time: datetime
    end_time: datetime

##################
### SENSOR LOGS ###
##################

class SensorLogStatus(str, Enum):
    INFO = 'INFO'
    WARNING = 'WARNING'
    ERROR = 'ERROR'

class SensorLogSchema(BaseModel):
    status: SensorLogStatus
    status_message: str
    signal_strength: int
    battery_voltage: float
    battery_percentage: int
    time: datetime

### GET ###
class GetSensorLogsSchema(BaseModel):
    sensor_id: str
    timeframe: int
    period: str
    start_time: datetime
    end_time: datetime

class GetLastSensorLogSchema(BaseModel):
    sensor_id: str
