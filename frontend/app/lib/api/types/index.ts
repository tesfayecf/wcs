import * as UserTypes from "./users.serializers"
import * as ResourcesTypes from "./resources.serializers"
import * as WeatherTypes from "./weather.serializers"

export namespace Api {
    export import User = UserTypes
    export import Resources = ResourcesTypes
    export import Weather = WeatherTypes
}