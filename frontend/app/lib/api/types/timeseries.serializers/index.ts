export interface Channel {
    id?: number;
    label: string;
    version: string;
    unit: string;
    rate: number;
    measure: number;
}

export interface Chunk {
    id?: number;
    measure: number;
    startTime: string;
    endTime: string;
}

export interface GetChannel {
    id?: number;
}

export interface GetChannels {
    measure: number;
}

export interface GetLastRecord {
    sensorId: number;
    groupId: number;
    tankId: number;
}

export interface GetMeasuer {
    id?: number;
}

export interface GetMeasures {
    sensor: number;
}

export interface GetRecordsFlow {
    measureId: number;
    sensorId: number;
    groupId: number;
    tankId: number;
    startTime: string;
    endTime: string;
    timeframe: "minute" | "hour" | "day" | "week" | "month" | "year";
}

export interface GetRecords {
    sensorId: number;
    groupId: number;
    tankId: number;
    startTime: string;
    endTime: string;
    timeframe: "minute" | "hour" | "day" | "week" | "month" | "year";
}

export interface GetRecordsTrendForecast {
    measureId: number;
    sensorId: number;
    groupId: number;
    tankId: number;
    startTime: string;
    endTime: string;
    timeframe: "minute" | "hour" | "day" | "week" | "month" | "year";
}

export interface MeasureInfo {
    id?: number;
    label: string;
    name: string;
    description: string;
    type?: "Temperature" | "Pressure" | "Level" | "Counter" | "Vibration" | "Speed" | "Other";
}

export interface Measure {
    id?: number;
    label: string;
    name: string;
    description: string;
    type: "Temperature" | "Pressure" | "Level" | "Counter" | "Vibration" | "Speed" | "Other";
    sensor: number;
}

export interface RecordForecast {
    time: string;
    value: number;
}

export interface RecordInfo {
    time: number;
    min: number;
    max: number;
    value: number;
    channel: number;
    measure: number;
    sensor: number;
}

export interface Record {
    id?: number;
    value: number;
    channel: number;
    chunk: number;
    time: string;
}

export interface RecordsFlow {
    time: string;
    inputFlow: number;
    outputFlow: number;
    netChange: number;
}

