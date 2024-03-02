from enum import Enum

class Topics:
    REGISTER = "register"
    DATA = "data"
    COMMAND = "command"
    
class Types(Enum):
    REGISTER = 0
    DATA = 1
    COMMAND = 2

class Actions(Enum):
    # Register
    REGISTER_SENSOR = 0,
    # Data
    SENSOR_DATA = 1,
    # Command


class Parameters(Enum):
    # Metadata
    MESSAGE_ID = 101,
    TIMESTAMP = 102,
    SENSOR_TIME = 103,
    VERSION = 104,
    SENSOR_ID = 105,

    # Action
    ACTION_TYPE = 201,
    ACTION_NAME = 202,
