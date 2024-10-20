import { Api } from "@/app/lib/api/types";

export namespace Tank {
    /// TANK PARAMS ///
    export interface ITankParams {
        tankId: string
    }

    /// TANK STORE ///
    export interface ITankStore {

    }

    /// TANK ///
    export type ITank = Api.Resources.Tank;

    export interface ITankCreationForm {
        name: string;
        type: string;
        capacity: number;
        is_active: boolean;
    }

    export type ITankStatus = "Connected" | "Disconnected" | "Undefined"
}