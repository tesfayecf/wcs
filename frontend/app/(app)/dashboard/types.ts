import { Api } from "@/app/lib/api/types";
import { Group } from "../group/[groupId]/types";

export namespace Dashboard {

    /// DASHBOARD STORE ///
    export interface IDashboardStore {
        groups: Group.IGroup[];
        groupMenu: Group.IGroupMenu;
        currentWeather: Api.Weather.CurrentWeather | null;
        forecastWeather: Api.Weather.ForecastWeather[];
    }

    /// WEATHER ///
    export interface ICurrentWeather extends Api.Weather.CurrentWeather { }
    export interface IForecastWeather extends Api.Weather.ForecastWeather { }
}