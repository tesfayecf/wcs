from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

###############
### WEATHER ###
###############

class GetWeatherSchema(BaseSchema):
    city_name: str
    
    class Config:
        from_attributes = True