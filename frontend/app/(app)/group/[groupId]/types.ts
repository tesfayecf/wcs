import { Api } from "@/app/lib/api/types";
import { Tank } from "@/app/(app)/group/[groupId]/tank/[tankId]/types";

export namespace Group {
    /// GROUP PARAMS ///
    export interface IGroupParams {
        groupId: string;
    }

    /// GROUP STORE ///
    export interface IGroupStore {
        groupId: number;
        group: IGroup;
        groupStats: IGroupStats;
        tankId: number;
        tanks: Tank.ITank[];
        showTankMenu: boolean;
    }

    /// GROUP ///
    export type IGroup = Api.Resources.Group;

    export interface IGroupMenu {
        id: number;
        mode: "info" | "create" | "edit" | "delete" | "";
        show: boolean;
    }

    export interface IGroupForm {
        name: string;
        location: string;
        description: string;
    }

    export interface IGroupStatus {
        id: number;
        name: string;
        level: number;
        capacity: number;
    }

    export interface IGroupLevel {
        id: number;
        name: string;
        time: number[];
        level: number[];
    }

    export interface IGroupStats {
        totalTanks: number,
        averageWaterLevel: number,
        minWaterLevel: number,
        maxWaterLevel: number,
        totalCapacity: number,
    }
}
