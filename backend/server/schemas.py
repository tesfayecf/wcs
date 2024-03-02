from pydantic import BaseModel
from enum import Enum

class MESSAGE_TYPES(Enum):
    REGISTER = 0
    DATA = 1
    COMMAND = 2

class MESSAGE_ACTIONS(Enum):
    REGISTER_SENSOR = 0
    SENSOR_DATA = 1

class MQTTMessageSchema(BaseModel):
    type: MESSAGE_TYPES
    action: MESSAGE_ACTIONS
    params: list[str]
    paramsCount: int
