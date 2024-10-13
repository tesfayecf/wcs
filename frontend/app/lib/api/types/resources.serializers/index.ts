export interface CreateGroup {
    name: string;
    location: string;
    description: string;
    user: number;
}

export interface CreateSensor {
    name: string;
    description: string;
    notes: string;
    deviceId: string;
    status: "Idle" | "Connecting" | "Connected" | "Disconnecting" | "Disconnected" | "Error";
    installationDate?: string | null;
    maintenanceDate?: string | null;
    isActive?: boolean;
    tank: number;
}

export interface CreateTank {
    name: string;
    description: string;
    type: "Storage" | "Well" | "Reservoir" | "Tank" | "Other";
    capacity: number;
    isActive?: boolean;
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
    editedAt?: string;
    createdAt?: string;
    totalTanks?: number;
    totalActiveTanks?: number;
    totalSensors?: number;
    totalActiveSensors?: number;
    maxCapacity?: number;
    currentCapacity?: number;
    averageCapacity: number;
}

export interface Group {
    id?: number;
    name: string;
    location: string;
    description: string;
    editedAt?: string;
    createdAt?: string;
    user?: number;
}

export interface Sensor {
    id?: number;
    name: string;
    description: string;
    notes: string;
    deviceId: string;
    status: "Idle" | "Connecting" | "Connected" | "Disconnecting" | "Disconnected" | "Error";
    installationDate?: string | null;
    maintenanceDate?: string | null;
    isActive?: boolean;
    editedAt?: string;
    createdAt?: string;
    tank: number;
}

export interface TankInfo {
    id?: number;
    name: string;
    description?: string;
    type?: "Storage" | "Well" | "Reservoir" | "Tank" | "Other";
    capacity?: number;
    isActive?: boolean;
    editedAt?: string;
    createdAt?: string;
    totalSensors?: number;
    totalActiveSensors?: number;
}

export interface Tank {
    id?: number;
    name: string;
    description: string;
    type: "Storage" | "Well" | "Reservoir" | "Tank" | "Other";
    capacity: number;
    isActive?: boolean;
    editedAt?: string;
    createdAt?: string;
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
    deviceId?: string;
    status?: "Idle" | "Connecting" | "Connected" | "Disconnecting" | "Disconnected" | "Error";
    installationDate?: string;
    maintenanceDate?: string;
    isActive?: boolean;
    tank: number;
}

export interface UpdateTank {
    id: number;
    name?: string;
    description?: string;
    type?: "Storage" | "Well" | "Reservoir" | "Tank" | "Other";
    capacity?: number;
    isActive?: boolean;
    group: number;
}

