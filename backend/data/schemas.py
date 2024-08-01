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

    class Config:
        from_attributes = True

### CREATE ###
class CreateGroupSchema(BaseSchema):
    name: str
    location: str
    description: str
    
    class Config:
        from_attributes = True

### EDIT ###
class EditGroupSchema(BaseSchema):
    id: int
    name: str
    location: str
    description: str
    
    class Config:
        from_attributes = True

### DELETE ###
class DeleteGroupSchema(BaseSchema):
    id: int

    class Config:
        from_attributes = True

class GetGroupSchema(BaseSchema):
    id: int

    class Config:
        from_attributes = True

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

    class Config:
        from_attributes = True

### GET ###
class GetTanksSchema(BaseSchema):
    group_id: int

### CREATE ###
class CreateTankSchema(BaseSchema):
    name: str
    type: TankType
    capacity: int
    group_id: int
    
    class Config:
        from_attributes = True

### EDIT ###
class EditTankSchema(BaseSchema):
    id: int
    name: str
    type: TankType
    capacity: int
    is_active: bool
    group_id: int
    
    class Config:
        from_attributes = True

### DELETE ###
class DeleteTankSchema(BaseSchema):
    id: int
    group_id: int

    class Config:
        from_attributes = True

##############
### SENSOR ###
##############

class SensorSchema(BaseSchema):
    id: int
    sensor_id: str
    is_active: bool
    date_created: datetime
    date_modified: datetime

    class Config:
        from_attributes = True

### GET ###
class GetSensorSchema(BaseSchema):
    tank_id: int
    group_id: int

### CREATE ###
class CreateSensorSchema(BaseSchema):
    sensor_id: str
    tank_id: int
    group_id: int

    class Config:
        from_attributes = True

### EDIT ###
class EditSensorSchema(BaseSchema):
    id: int
    sensor_id: str
    is_active: bool
    tank_id: int
    group_id: int

    class Config:
        from_attributes = True

### DELETE ###
class DeleteSensorSchema(BaseSchema):
    sensor_id: int
    tank_id: int
    group_id: int

    class Config:
        from_attributes = True


