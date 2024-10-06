from enum import Enum

class Topic(Enum):
    REGISTER = "register"
    DATA = "data"
    COMMAND = "command"

class MessageParam(Enum):
    ACTION = 'a'
    META = 'm'

class ActionParam(Enum):
    TYPE = 't'
    NAME = 'n'
    PAYLOAD = 'p'
    PAYLOAD_COUNT = 'c'

class ActionType(Enum):
    REGISTER = 'r'
    DATA = 'd'
    COMMAND = 'c'

class RegisterAction(Enum):
    NEW_SENSOR = 'n'
    UPDATE_SENSOR = 'u'
    REMOVE_SENSOR = 'x'

class DataAction(Enum):
    SENSOR_READING = 's'
    BATCH_READINGS = 'b'
    ERROR_REPORT = 'e'

class CommandAction(Enum):
    SET_INTERVAL = 'i'
    CALIBRATE = 'k'
    UPDATE_FIRMWARE = 'f'
    RESET = 'r'

class MetaParam(Enum):
    MESSAGE_ID = 'm'
    TIMESTAMP = 't'
    SENSOR_TIME = 's'
    VERSION = 'v'
    SENSOR_ID = 'i'