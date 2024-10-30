export interface CurrentWeather {
    city_name: string;
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
    city_name: string;
}

export interface GetForecastWeather {
    city_name: string;
}

export interface GetWeatherByCoordinates {
    lat: number;
    lon: number;
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
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}

export interface WeatherWind {
    speed: number;
    deg: number;
}

