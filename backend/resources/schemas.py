from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

#############
### GROUP ###
#############

class GroupSchema(BaseSchema):
    id: int
    name: str
    location: str
    description: str
    date_created: datetime
    date_modified: datetime

### GET ###
class GetGroupSchema(BaseSchema):
    id: int

### CREATE ###
class CreateGroupSchema(BaseSchema):
    name: str
    location: str
    description: str

### EDIT ###
class EditGroupSchema(BaseSchema):
    id: int
    name: str
    location: str
    description: str

### DELETE ###
class DeleteGroupSchema(BaseSchema):
    id: int

### INFO ###
class GroupStatsSchema(BaseSchema):
    id: int
    name: str
    time: list[int]
    inflow: list[float]
    outflow: list[float]
    savings: list[float]

class GroupStatusSchema(BaseSchema):
    id: int
    name: str
    level: float
    capacity: float

class GroupLevelSchema(BaseSchema):
    id: int
    name: str
    time: list[int]
    level: list[float]
  
############
### TANK ###
############

class TankType(str, Enum):
    STORAGE = 'Storage'
    WELL = 'Well'
    RESERVOIR = 'Reservoir'
    TANK = 'Tank'
    OTHER = 'Other'

class TankSchema(BaseSchema):
    id: int
    name: str
    type: TankType
    capacity: int
    is_active: bool
    date_created: datetime
    date_modified: datetime

### GET ###
class GetTankSchema(BaseSchema):
    id: int
    group_id: int

class GetTanksSchema(BaseSchema):
    group_id: int

### CREATE ###
class CreateTankSchema(BaseSchema):
    name: str
    type: TankType
    capacity: int
    group_id: int

### EDIT ###
class EditTankSchema(BaseSchema):
    id: int
    name: str
    type: TankType
    capacity: int
    is_active: bool
    group_id: int

### DELETE ###
class DeleteTankSchema(BaseSchema):
    id: int
    group_id: int

### INFO ###
class TankStatsSchema(BaseSchema):
    id: int
    name: str
    inflow: list[int]
    outflow: list[int]
    savings: list[int]

class TankLevelSchema(BaseSchema):
    id: int
    name: str
    level: list[int]

class TankStatusSchema(BaseSchema):
    id: int
    name: str
    level: int
    capacity: int
    is_active: bool
    has_sensors: bool

##############
### SENSOR ###
##############

class SensorSchema(BaseSchema):
    id: int
    sensor_id: str
    is_active: bool
    date_created: datetime
    date_modified: datetime

### GET ###
class GetSensorSchema(BaseSchema):
    tank_id: int
    group_id: int

### CREATE ###
class CreateSensorSchema(BaseSchema):
    sensor_id: str
    tank_id: int
    group_id: int

### EDIT ###
class EditSensorSchema(BaseSchema):
    id: int
    sensor_id: str
    is_active: bool
    tank_id: int
    group_id: int

### DELETE ###
class DeleteSensorSchema(BaseSchema):
    sensor_id: int
    tank_id: int
    group_id: int

############
### INFO ###
############

class StatsSchema(BaseSchema):
    stats: list[GroupStatsSchema]

class SummarySchema(BaseSchema):
    status: list[GroupStatusSchema]
    level: list[GroupLevelSchema]