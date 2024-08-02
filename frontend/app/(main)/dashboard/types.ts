import { IMenu } from "@/app/app/types";

export interface IDashboardStore {
    summary: ISummary;
    groups: IGroup[];
    groupMenu: IMenu;
    showGroupMenu: boolean;
}

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

export interface IGroupStats {
    totalTanks: number,
    averageWaterLevel: number,
    minWaterLevel: number,
    maxWaterLevel: number,
    totalCapacity: number,
}

export interface ISummary {
    level: number[],
    inflow: number[],
    outflow: number[],
    savings: number[],
}

export interface CurrentWeatherInfo {
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