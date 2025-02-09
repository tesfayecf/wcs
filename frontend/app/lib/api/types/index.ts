import * as UserTypes from "./users.serializers"
import * as ResourcesTypes from "./resources.serializers"
import * as TimeseriesTypes from "./timeseries.serializers"
import * as WeatherTypes from "./weather.serializers"

export namespace Api {
    export import Users = UserTypes
    export import Resources = ResourcesTypes
    export import Timeseries = TimeseriesTypes
    export import Weather = WeatherTypes
}