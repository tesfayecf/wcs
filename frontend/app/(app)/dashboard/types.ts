import { IMenu } from "@/app/app/types";

/// DASHBOARD STORE ///
export interface IDashboardStore {
    summary: ISummary;
    groups: IGroup[];
    groupMenu: IMenu;
    showGroupMenu: boolean;
    currentWeather: ICurrentWeather | null;
    forecastWeather: IForecastWeather[];
}

/// GROUP ///
export interface IGroup {
    id: number;
    name: string;
    location: string;
    description: string;
}

export interface IGroupCreationForm {
    name: string,
    location: string,
    description: string
}

export interface IGroupStatus {
    id: number;
    name: string;
    level: number;
    capacity: number;
}

export interface IGroupLevel {
    id: number;
    name: string;
    time: number[];
    level: number[];
}

export interface IGroupStats {
    totalTanks: number,
    averageWaterLevel: number,
    minWaterLevel: number,
    maxWaterLevel: number,
    totalCapacity: number,
}

/// SUMMARY ///

export interface ISummary {
    status: IGroupStatus[];
    level: IGroupLevel[];
}


/// STATS ///


/// WEATHER ///
export interface ICurrentWeather {
    city_name: string;
    coord: {
        lon: number;
        lat: number;
    };
    weather: {
        main: string;
        description: string;
    }[];
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    wind: {
        speed: number;
        deg: number;
    };
    timestamp: string;
};

export interface IForecastWeather {
    date: string;
    description: string;
    icon: string;
    temperature: ITemperature,
    wind: number;
    humidity: number;
}

export interface ITemperature {
    min: number
    max: number
}