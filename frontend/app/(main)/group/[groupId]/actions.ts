'use server'

import { serverRequest } from "@/app/lib/api/server";
import { ISensorCreationForm, ITank, ITankCreationForm } from "./types";
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

export const createSensor = async (fields: ISensorCreationForm, tankId: number, groupId: number) => {
    try {
        // Get fields
        const sensorId = fields.sensorId;

        const response = await serverRequest("sensor", "createSensor", [sensorId, tankId, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const editSensor = async (id, tankId, groupId, fields: ISensorCreationForm) => {
    try {
        // Get fields
        const sensorId = fields.sensorId;
        const isActive = true;

        const response = await serverRequest("sensor", "editSensor", [id, sensorId, isActive, tankId, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const deleteSensor = async (sensorId: number, tankId: number, groupId: number) => {
    try {
        const response = await serverRequest("sensor", "deleteSensor", [sensorId, tankId, groupId]);
        return response
    } catch (error) {
        // Log error
    }
}