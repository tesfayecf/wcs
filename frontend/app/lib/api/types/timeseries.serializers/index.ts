export enum TimeframeChoiceEnum {
    '1_MINUTE' = '1 minute',
    '5_MINUTES' = '5 minutes',
    '15_MINUTES' = '15 minutes',
    '1_HOUR' = '1 hour',
    '3_HOURS' = '3 hours',
    '1_DAY' = '1 day',
    '3_DAYS' = '3 days',
    '1_WEEK' = '1 week',
    '2_WEEKS' = '2 weeks',
    '1_MONTH' = '1 month',
    '3_MONTHS' = '3 months',
    '6_MONTHS' = '6 months',
    '1_YEAR' = '1 year',
}

export enum TypeChoiceEnum {
    TEMPERATURE = 'Temperature',
    PRESSURE = 'Pressure',
    LEVEL = 'Level',
    COUNTER = 'Counter',
    VIBRATION = 'Vibration',
    SPEED = 'Speed',
    OTHER = 'Other',
}


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
    start_time: string;
    end_time: string;
}

export interface GetChannel {
    id?: number;
}

export interface GetChannels {
    measure: number;
}

export interface GetLastRecord {
    measuer_id: number;
    sensor_id: number;
    group_id: number;
    tank_id: number;
}

export interface GetMeasuer {
    id?: number;
}

export interface GetMeasures {
    sensor: number;
}

export interface GetRecordsFlow {
    measure_id?: number;
    sensor_id?: number;
    tank_id: number;
    group_id: number;
    start_time: string;
    end_time: string;
    timeframe: TimeframeChoiceEnum;
}

export interface GetRecords {
    tank_id?: number;
    group_id: number;
    start_time: string;
    end_time: string;
    timeframe: TimeframeChoiceEnum;
}

export interface GetRecordsTrendForecast {
    measure_id?: number;
    sensor_id?: number;
    tank_id: number;
    group_id: number;
    start_time: string;
    end_time: string;
    timeframe: TimeframeChoiceEnum;
}

export interface Measure {
    id?: number;
    label: string;
    name: string;
    description: string;
    type: TypeChoiceEnum;
    sensor: number;
}

export interface RecordFlow {
    time: string;
    input_flow: number;
    output_flow: number;
    net_change: number;
}

export interface RecordInfo {
    id?: number;
    time: string;
    min: number;
    max: number;
    value: number;
    channel?: number;
    measure?: number;
    sensor: number;
    chunk: number;
}

export interface Record {
    id?: number;
    value: number;
    channel: number;
    chunk: number;
    measure?: number;
    time: string;
}

export interface RecordTrendForecast {
    time: string;
    value: number;
}

