

export interface IDashboardStore {
    groups: IGroup[];
    showEditGroupMenu: boolean;
    showDeleteGroupMenu: boolean;
    selectedGroup: number;
    summary: any;
    showGroupMenu: boolean;
}

export interface IGroup {
    id: number;
    name: string;
    location: string;
    description: string;
}

export interface IGroupStats {
    totalTanks: number,
    averageWaterLevel: number,
    minWaterLevel: number,
    maxWaterLevel: number,
    totalCapacity: number,
}

export interface IGroupCreationForm {
    "Name": string;
    "Location": string;
    "Description": string;
}