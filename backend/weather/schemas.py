from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

###############
### CURRENT ###
###############

class GetCurrentWeatherSchema(BaseModel):
    city_name: str

class WeatherMainSchema(BaseModel):
    main: str
    description: str

class WeatherMainDetailsSchema(BaseModel):
    temp: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int

class WeatherWindSchema(BaseModel):
    speed: float
    deg: int

class WeatherCoordSchema(BaseModel):
    lon: float
    lat: float

class CurrentWeatherResponseSchema(BaseSchema):
    city_name: str
    coord: WeatherCoordSchema
    weather: List[WeatherMainSchema]
    main: WeatherMainDetailsSchema
    wind: WeatherWindSchema
    timestamp: datetime

################
### FORECAST ###
################

class GetForecastWeatherSchema(BaseModel):
    city_name: str

class ForecastWeatherSchema(BaseModel):
    temp: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int
    weather_main: str
    weather_description: str
    wind_speed: float
    wind_deg: int

class ForecastWeatherResponseSchema(BaseSchema):
    date: datetime
    description: str
    icon: str
    temperature: Dict[str, float]
    wind: float
    humidity: int