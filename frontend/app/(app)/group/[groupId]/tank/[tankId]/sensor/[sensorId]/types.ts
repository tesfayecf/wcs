import { Api } from "@/app/lib/api/types";


export namespace Sensor {

    /// SENSOR PARAMS ///
    export interface ISensorParams {
        sensorId: string
    }

    /// SENSOR STORE ///
    export interface ISensorStore { }

    /// SENSOR ///
    export type ISensor = Api.Resources.Sensor;

    export interface ISensorCreationForm {
        sensorId: string;
    }

    export interface ISensorReading {
        time: Date;
        distance: number;
    }

}