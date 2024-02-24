export interface IDashboardStore {
    summary: any;
    groups: IGroup[];
    selectedGroup: number;
    showCreateGroupMenu: boolean;
    showEditGroupMenu: boolean;
    showDeleteGroupMenu: boolean;
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
    name: string,
    location: string,
    description: string
}