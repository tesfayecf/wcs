import { IMenu } from "@/app/app/types";

export interface IDashboardStore {
    summary: any;
    groups: IGroup[];
    groupMenu: IMenu;
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
    name: string,
    location: string,
    description: string
}