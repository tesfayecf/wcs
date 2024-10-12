import { Api } from "./types";

export interface APIResponse<T> {
    data?: T;
    error?: any;
    request?: any;
    status?: number;
    statusText?: string;
    headers?: any;
    config?: any;
    isSuccess?: boolean,
    isRedirect?: boolean,
    isClientError?: boolean,
    isServerError?: boolean,
}

export const apiInterface = {
    app: {},
    auth: {
        login: {
            endpoint: "api/users/login/",
            method: "POST",
            args: {} as Api.User.Login,
            data: {} as Api.User.User,
        },
        logout: {
            endpoint: "api/users/logout/",
            method: "POST",
            args: {},
            data: {},
        },
        recover: {
            endpoint: "api/users/recover/",
            method: "POST",
            args: {} as Api.User.Recover,
            data: {},
        },
        reset: {
            endpoint: "api/users/reset/",
            method: "POST",
            args: {}  as Api.User.Reset,
            data: {},
        },
        signup: {
            endpoint: "api/users/signup/",
            method: "POST",
            args: {} as Api.User.Signup,
            data: {},
        },
        verify: {
            endpoint: "api/users/verify/",
            method: "POST",
            args: {},
            data: {},
        },
        refresh: {
            endpoint: "api/users/refresh/",
            method: "POST",
            args: {},
            data: {},
        },
    },
    user: {
        createUser : {},
        getUser: {},
        getUserInfo: {
            endpoint: "api/users/get-user/",
            method: "POST",
            args: {},
            data: {} as Api.User.User,
        },
        getUsersInfo: {},
        updateUser: {},
        deleteUser: {},
    },
    group: {
        createGroup: {
            endpoint: "api/data/create-group/",
            method: "POST",
            args: {} as Api.Data.CreateGroup,
            data: {} as Api.Data.Group,
        },
        getGroup: {
            endpoint: "api/data/get-group/",
            method: "POST",
            args: {} as Api.Data.GetGroup,
            data: {} as Api.Data.Group,
        },
        getData: {
            endpoint: "api/data/get-Data/",
            method: "POST",
            args: {},
            data: {} as Api.Data.Group[]
        },
        updateGroup: {
            endpoint: "api/data/update-group/",
            method: "POST",
            args: {} as Api.Data.UpdateGroup,
            data: {} as Api.Data.Group,
        },
        deleteGroup: {
            endpoint: "api/data/delete-group/",
            method: "POST",
            args: {} as Api.Data.DeleteGroup,
            data: {} as Api.Data.Group,
        },
        groupInfo: {
            endpoint: "api/data/group-info/",
            method: "POST",
            args: {} as Api.Data.GetGroupInfo,
            data: {} as Api.Data.GroupInfo,
        },
        // groupMetrics: {
        //     endpoint: "api/data/group-metrics/",
        //     method: "POST",
        //     args: {} as Api.Data.GetGroupMetrics,
        //     data: {} as Api.Data.GroupMetrics,
        // }
    },
    tank: {
        createTank: {
            endpoint: "api/data/create-tank/",
            method: "POST",
            args: {} as Api.Data.CreateTank,
            data: {} as Api.Data.Tank,
        },
        getTank: {
            endpoint: "api/data/get-tank/",
            method: "POST",
            args: {} as Api.Data.GetTank,
            data: {} as Api.Data.Tank,
        },
        getTanks: {
            endpoint: "api/data/get-tanks/",
            method: "POST",
            args: {} as Api.Data.GetTanks,
            data: {} as Api.Data.Tank[],
        },
        updateTank: {
            endpoint: "api/data/update-tank/",
            method: "POST",
            args: {} as Api.Data.UpdateTank,
            data: {} as Api.Data.Tank,
        },
        deleteTank: {
            endpoint: "api/data/delete-tank/",
            method: "POST",
            args: {} as Api.Data.DeleteTank,
            data: {} as Api.Data.TankInfo,
        },
    },
    sensor: {
        createSensor: {
            endpoint: "api/data/create-sensor/",
            method: "POST",
            args: {} as Api.Data.CreateSensor,
            data: {} as Api.Data.Sensor,
        },
        getSensor: {
            endpoint: "api/data/get-sensor/",
            method: "POST",
            args: {} as Api.Data.GetSensor,
            data: {} as Api.Data.Sensor,
        },
        getSensors: {
            endpoint: "api/data/get-sensors/",
            method: "POST",
            args: {} as Api.Data.GetSensors,
            data: {} as Api.Data.Sensor[],
        },
        updateSensor: {
            endpoint: "api/data/update-sensor/",
            method: "POST",
            args: {} as Api.Data.UpdateSensor,
            data: {} as Api.Data.Sensor,
        },
        deleteSensor: {
            endpoint: "api/data/delete-sensor/",
            method: "POST",
            args: {} as Api.Data.DeleteSensor,
            data: {},
        },
    },
    timeseries: {
        // getSensorReadings: {
        //     endpoint: "api/timeseries/readings/",
        //     method: "POST",
        //     args: {} as Api.Timeseries.GetSensorReadings,
        //     data: {} as Api.Timeseries.SensorReading[],
        // },
        // getSensorLastReading: {
        //     args: (sensor_id: string) => { return {} as ISensorReading },
        //     endpoint: "api/timeseries/last-reading/",
        //     method: "POST",
        //     argsKeys: ["sensor_id"],
        // },
        // getSensorFlow: {
        //     args: (sensor_id: string) => { return {} as any },
        //     endpoint: "api/timeseries/flow/",
        //     method: "POST",
        //     argsKeys: ["sensor_id"],
        // }
    },
    info: {
        // stats: {
        //     args: () => { return {} as any },
        //     endpoint: "api/data/stats/",
        //     method: "POST",
        //     argsKeys: [],
        // },
        // summary: {
        //     args: () => { return {} as ISummary },
        //     endpoint: "api/data/summary/",
        //     method: "POST",
        //     argsKeys: [],
        // }
    },
    weather: {
        getCurrentWeather: {
            endpoint: "api/weather/current/",
            method: "POST",
            args: {} as Api.Weather.GetCurrentWeather,
            data: {} as Api.Weather.CurrentWeather,
        },
        getForecastWeather: {
            endpoint: "api/weather/forecast/",
            method: "POST",
            args: {} as Api.Weather.GetForecastWeather,
            data: {} as Api.Weather.ForecastWeather,
        }
    }
} as const;