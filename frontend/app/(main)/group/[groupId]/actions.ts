'use server'

import { serverRequest } from "@/app/lib/api/server";
import { ITank, ITankCreationForm } from "./types";
import { revalidateTag } from "next/cache";

// Group
export const getGroup = async (groupId: number) => {
    const response = await serverRequest("group", "getGroups", []);
    if (!response.ok) return undefined

    // Filter groups by id
    return response.data.filter(group => group.id === groupId)[0] || undefined;
}

// TANK
export const getTanks = async (groupId: number) => {
    return await serverRequest("tank", "getTanks", [groupId]);
}

export const createTank = async (fields: ITankCreationForm, groupId: number) => {
    try {
        // Get fields
        const name = fields.name;
        const type = fields.type;
        const capacity = fields.capacity;

        const response = await serverRequest("tank", "createTank", [name, type, capacity, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const editTank = async (tankId: number, groupId: number, fields: ITankCreationForm) => {
    try {
        // Get fields
        const name = fields.name;
        const type = fields.type;
        const capacity = fields.capacity;
        const is_active = true;

        const response = await serverRequest("tank", "editTank", [tankId, name, type, capacity, is_active, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const deleteTank = async (tankId: number, groupId: number) => {
    try {
        const response = await serverRequest("tank", "deleteTank", [tankId, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

// SENSOR
export const getSensor = async (tankId: number, groupId: number) => {
    try {
        const response = await serverRequest("sensor", "getSensor", [tankId, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const createSensor = async (token: string, tankId: number, groupId: number) => {
    try {
        // const tankId = store.getState().tank.tankId;
        const response = await serverRequest("sensor", "createSensor", [token, tankId, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const editSensor = async () => {
    try {
        // const sensorId = -1;
        // const token = "";
        // const is_active = true;
        // const tankId = -1;
        // const groupId = store.getState().group.groupId;
        // const response = await serverRequest("sensor", "editSensor", [sensorId, token, is_active, tankId, groupId]);
        // if (response.isSuccess) {
        //     this.getSensors();
        // }
    } catch (error) {
        // Log error
    }
}

export const deleteSensor = async () => {
    try {
        // const sensorId = -1;
        // const tankId = -1;
        // const groupId = store.getState().group.groupId;
        // const response = await serverRequest("sensor", "deleteSensor", [sensorId, tankId, groupId]);
        // if (response.isSuccess) {
        //     this.getSensors();
        // }
    } catch (error) {
        // Log error
    }
}