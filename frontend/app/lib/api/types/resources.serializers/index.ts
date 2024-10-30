export enum StatusChoiceEnum {
    IDLE = 'Idle',
    CONNECTING = 'Connecting',
    CONNECTED = 'Connected',
    DISCONNECTING = 'Disconnecting',
    DISCONNECTED = 'Disconnected',
    ERROR = 'Error',
}

export enum TypeChoiceEnum {
    STORAGE = 'Storage',
    WELL = 'Well',
    RESERVOIR = 'Reservoir',
    TANK = 'Tank',
    OTHER = 'Other',
}


export interface CreateGroup {
    name: string;
    location: string;
    description: string;
}

export interface CreateSensor {
    name: string;
    description: string;
    notes: string;
    device_id: string;
    status: StatusChoiceEnum;
    installation_date?: string | null;
    maintenance_date?: string | null;
    is_active?: boolean;
    tank: number;
}

export interface CreateTank {
    name: string;
    description: string;
    type: TypeChoiceEnum;
    capacity: number;
    is_active?: boolean;
    group: number;
}

export interface DeleteGroup {
    id: number;
}

export interface DeleteSensor {
    id: number;
}

export interface DeleteTank {
    id: number;
}

export interface GetGroupInfo {
    id: number;
}

export interface GetGroupMetrics {
    id: number;
}

export interface GetGroup {
    id: number;
}

export interface GetSensor {
    id?: number;
}

export interface GetSensors {
    tank: number;
}

export interface GetTankInfo {
    id?: number;
}

export interface GetTank {
    id?: number;
}

export interface GetTanks {
    group: number;
}

export interface GroupInfo {
    id?: number;
    name: string;
    location: string;
    description?: string;
    edited_at?: string;
    created_at?: string;
    total_tanks?: number;
    total_active_tanks?: number;
    total_sensors?: number;
    total_active_sensors?: number;
    max_capacity?: number;
    current_capacity?: number;
    average_capacity: number;
    user?: number;
}

export interface Group {
    id?: number;
    name: string;
    location: string;
    description: string;
    edited_at?: string;
    created_at?: string;
    user?: number;
}

export interface SensorInfo {
    id?: number;
    name: string;
    description?: string;
    notes?: string;
    device_id?: string;
    status?: StatusChoiceEnum;
    installation_date?: string;
    maintenance_date?: string;
    is_active?: boolean;
    edited_at?: string;
    created_at?: string;
    tank: number;
    num_measures?: number;
    num_channels?: number;
    num_records?: number;
    last_record?: string;
}

export interface Sensor {
    id?: number;
    name: string;
    description: string;
    notes: string;
    device_id: string;
    status: StatusChoiceEnum;
    installation_date?: string | null;
    maintenance_date?: string | null;
    is_active?: boolean;
    edited_at?: string;
    created_at?: string;
    tank: number;
}

export interface TankInfo {
    id?: number;
    name: string;
    description?: string;
    type?: TypeChoiceEnum;
    capacity?: number;
    is_active?: boolean;
    edited_at?: string;
    created_at?: string;
    total_sensors?: number;
    total_active_sensors?: number;
    group: number;
}

export interface Tank {
    id?: number;
    name: string;
    description: string;
    type: TypeChoiceEnum;
    capacity: number;
    is_active?: boolean;
    edited_at?: string;
    created_at?: string;
    group: number;
}

export interface UpdateGroup {
    id: number;
    name?: string;
    location?: string;
    description?: string;
}

export interface UpdateSensor {
    id: number;
    name?: string;
    description?: string;
    notes?: string;
    device_id?: string;
    status?: StatusChoiceEnum;
    installation_date?: string;
    maintenance_date?: string;
    is_active?: boolean;
    tank: number;
}

export interface UpdateTank {
    id: number;
    name?: string;
    description?: string;
    type?: TypeChoiceEnum;
    capacity?: number;
    is_active?: boolean;
    group: number;
}

