export interface CurrentWeather {
    cityName: string;
    coord: WeatherCoord;
    weather: WeatherDescription[];
    main: WeatherDetails;
    wind: WeatherWind;
    timestamp: string;
}

export interface ForecastWeather {
    date: string;
    description: string;
    icon: string;
    temperature: number[];
    wind: number;
    humidity: number;
}

export interface GetCurrentWeather {
    cityName: string;
}

export interface GetForecastWeather {
    cityName: string;
}

export interface WeatherCoord {
    lon: number;
    lat: number;
}

export interface WeatherDescription {
    main: string;
    description: string;
}

export interface WeatherDetails {
    temp: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    pressure: number;
    humidity: number;
}

export interface WeatherWind {
    speed: number;
    deg: number;
}

