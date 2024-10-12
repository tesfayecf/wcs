import * as UserTypes from "./users.serializers"
import * as DataTypes from "./data.serializers"
import * as WeatherTypes from "./weather.serializers"

export namespace Api {
    export import User = UserTypes
    export import Data = DataTypes
    export import Weather = WeatherTypes
}