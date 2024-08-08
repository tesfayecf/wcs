from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

###############
### WEATHER ###
###############