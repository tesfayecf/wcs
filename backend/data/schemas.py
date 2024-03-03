from pydantic import BaseModel
from datetime import datetime
from enum import Enum

#############
### GROUP ###
#############

class GroupSchema(BaseModel):
    id: int
    name: str
    location: str
    description: str
    date_created: datetime
    date_modified: datetime

    class Config:
        from_attributes = True

### CREATE ###
class CreateGroupSchema(BaseModel):
    name: str
    location: str
    description: str
    
    class Config:
        from_attributes = True

### EDIT ###
class EditGroupSchema(BaseModel):
    id: int
    name: str
    location: str
    description: str
    
    class Config:
        from_attributes = True

### DELETE ###
class DeleteGroupSchema(BaseModel):
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

class TankSchema(BaseModel):
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
class GetTanksSchema(BaseModel):
    group_id: int

### CREATE ###
class CreateTankSchema(BaseModel):
    name: str
    type: TankType
    capacity: int
    group_id: int
    
    class Config:
        from_attributes = True

### EDIT ###
class EditTankSchema(BaseModel):
    id: int
    name: str
    type: TankType
    capacity: int
    is_active: bool
    group_id: int
    
    class Config:
        from_attributes = True

### DELETE ###
class DeleteTankSchema(BaseModel):
    id: int
    group_id: int

    class Config:
        from_attributes = True

##############
### SENSOR ###
##############

class SensorSchema(BaseModel):
    id: int
    token: str
    is_active: bool
    date_created: datetime
    date_modified: datetime

    class Config:
        from_attributes = True

### GET ###
class GetSensorSchema(BaseModel):
    tank_id: int
    group_id: int

### CREATE ###
class CreateSensorSchema(BaseModel):
    sensor_id: str
    tank_id: int
    group_id: int

    class Config:
        from_attributes = True

### EDIT ###
class EditSensorSchema(BaseModel):
    id: int
    sensor_id: str
    is_active: bool
    tank_id: int
    group_id: int

    class Config:
        from_attributes = True

### DELETE ###
class DeleteSensorSchema(BaseModel):
    sensor_id: int
    tank_id: int
    group_id: int

    class Config:
        from_attributes = True


