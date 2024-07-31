from enum import Enum

class Topic:
    REGISTER = "register"
    DATA = "data"
    COMMAND = "command"

class MessageParam(Enum):
    ACTION = 'a'
    META = 'm'
    
class ActionParam(Enum):
    TYPE = 't'
    NAME = 'n'
    PARAMS = 'p'
    PARAMS_COUNT = 'pc'

class ActionType(Enum):
    REGISTER = 'r'
    DATA = 'd'
    COMMAND = 'c'

class RegisterAction(Enum):
    NEW_SENSOR = 'n'
    UPDATE_SENSOR = 'u'
    REMOVE_SENSOR = 'r'

class DataAction(Enum):
    SENSOR_READING = 's'
    BATCH_READINGS = 'b'
    ERROR_REPORT = 'e'

class CommandAction(Enum):
    SET_INTERVAL = 'i'
    CALIBRATE = 'c'
    UPDATE_FIRMWARE = 'f'
    RESET = 'r'

class MetaParam(Enum):
    MESSAGE_ID = 'mid'
    TIMESTAMP = 'ts'
    SENSOR_TIME = 'st'
    VERSION = 'v'
    SENSOR_ID = 'sid'