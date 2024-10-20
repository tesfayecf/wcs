import { Api } from "./types";

export const apiInterface = {
    app: {},
    auth: {
        login: {
            endpoint: "api/users/login/",
            method: "POST",
            args: {} as Api.Users.Login,
            data: {} as Api.Users.User,
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
            args: {} as Api.Users.Recover,
            data: {},
        },
        reset: {
            endpoint: "api/users/reset/",
            method: "POST",
            args: {} as Api.Users.Reset,
            data: {},
        },
        signup: {
            endpoint: "api/users/signup/",
            method: "POST",
            args: {} as Api.Users.Signup,
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
        createUser: {},
        getUser: {},
        getUsers: {},
        getUserInfo: {
            endpoint: "api/users/get-user/",
            method: "POST",
            args: {},
            data: {} as Api.Users.User,
        },
        getUsersInfo: {},
        updateUser: {},
        deleteUser: {},
    },
    group: {
        createGroup: {
            endpoint: "api/resources/create-group/",
            method: "POST",
            args: {} as Api.Resources.CreateGroup,
            data: {} as Api.Resources.Group,
        },
        getGroup: {
            endpoint: "api/resources/get-group/",
            method: "POST",
            args: {} as Api.Resources.GetGroup,
            data: {} as Api.Resources.Group,
        },
        getGroups: {
            endpoint: "api/resources/get-groups/",
            method: "POST",
            args: {},
            data: {} as Api.Resources.Group[],
        },
        updateGroup: {
            endpoint: "api/resources/update-group/",
            method: "POST",
            args: {} as Api.Resources.UpdateGroup,
            data: {} as Api.Resources.Group,
        },
        deleteGroup: {
            endpoint: "api/resources/delete-group/",
            method: "POST",
            args: {} as Api.Resources.DeleteGroup,
            data: {} as Api.Resources.Group,
        },
        groupInfo: {
            endpoint: "api/resources/group-info/",
            method: "POST",
            args: {} as Api.Resources.GetGroupInfo,
            data: {} as Api.Resources.GroupInfo,
        },
        // groupMetrics: {
        //     endpoint: "api/resources/group-metrics/",
        //     method: "POST",
        //     args: {} as Api.Resources.GetGroupMetrics,
        //     data: {} as Api.Resources.GroupMetrics,
        // }
    },
    tank: {
        createTank: {
            endpoint: "api/resources/create-tank/",
            method: "POST",
            args: {} as Api.Resources.CreateTank,
            data: {} as Api.Resources.Tank,
        },
        getTank: {
            endpoint: "api/resources/get-tank/",
            method: "POST",
            args: {} as Api.Resources.GetTank,
            data: {} as Api.Resources.Tank,
        },
        getTanks: {
            endpoint: "api/resources/get-tanks/",
            method: "POST",
            args: {} as Api.Resources.GetTanks,
            data: {} as Api.Resources.Tank[],
        },
        updateTank: {
            endpoint: "api/resources/update-tank/",
            method: "POST",
            args: {} as Api.Resources.UpdateTank,
            data: {} as Api.Resources.Tank,
        },
        deleteTank: {
            endpoint: "api/resources/delete-tank/",
            method: "POST",
            args: {} as Api.Resources.DeleteTank,
            data: {} as Api.Resources.TankInfo,
        },
    },
    sensor: {
        createSensor: {
            endpoint: "api/resources/create-sensor/",
            method: "POST",
            args: {} as Api.Resources.CreateSensor,
            data: {} as Api.Resources.Sensor,
        },
        getSensor: {
            endpoint: "api/resources/get-sensor/",
            method: "POST",
            args: {} as Api.Resources.GetSensor,
            data: {} as Api.Resources.Sensor,
        },
        getSensors: {
            endpoint: "api/resources/get-sensors/",
            method: "POST",
            args: {} as Api.Resources.GetSensors,
            data: {} as Api.Resources.Sensor[],
        },
        updateSensor: {
            endpoint: "api/resources/update-sensor/",
            method: "POST",
            args: {} as Api.Resources.UpdateSensor,
            data: {} as Api.Resources.Sensor,
        },
        deleteSensor: {
            endpoint: "api/resources/delete-sensor/",
            method: "POST",
            args: {} as Api.Resources.DeleteSensor,
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
        //     endpoint: "api/resources/stats/",
        //     method: "POST",
        //     argsKeys: [],
        // },
        // summary: {
        //     args: () => { return {} as ISummary },
        //     endpoint: "api/resources/summary/",
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