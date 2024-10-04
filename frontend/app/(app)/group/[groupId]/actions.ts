'use server'

import { serverRequest } from "@/app/lib/api/request";
import { ISensor, ISensorCreationForm, ITank, ITankCreationForm } from "./types";

// Group
export const getGroup = async (groupId: number) => {
    try {
        // Make request
        const response = await serverRequest("group", "group", [groupId]); // TODO: make request or single group. 
        return response;
    } catch (error) {
        // Log error
    }
}

// TANK
export const getTanks = async (groupId: number) => {
    try {
        // Make request
        const response = await serverRequest("tank", "tanks", [groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const createTank = async (fields: ITankCreationForm, groupId: number) => {
    try {
        // Get fields
        const name = fields.name;
        const type = fields.type;
        const capacity = fields.capacity;
        // Make request
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
        // Make request
        const response = await serverRequest("tank", "editTank", [tankId, name, type, capacity, is_active, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const deleteTank = async (tankId: number, groupId: number) => {
    try {
        // Make request
        const response = await serverRequest("tank", "deleteTank", [tankId, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

// SENSOR
export const getSensor = async (tankId: number, groupId: number) => {
    try {
        const response = await serverRequest("sensor", "sensor", [tankId, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const createSensor = async (fields: ISensorCreationForm, tankId: number, groupId: number) => {
    try {
        // Get fields
        const sensorId = fields.sensorId;
        // Make request
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
        // Make request
        const response = await serverRequest("sensor", "editSensor", [id, sensorId, isActive, tankId, groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const deleteSensor = async (sensorId: number, tankId: number, groupId: number) => {
    try {
        // Make request
        const response = await serverRequest("sensor", "deleteSensor", [sensorId, tankId, groupId]);
        return response
    } catch (error) {
        // Log error
    }
}


export const getSensorReadings = async (sensorId: string) => {
    try {
        // Make request
        const response = await serverRequest("sensor", "getSensorReadings", [sensorId]);
        if (!response.ok) return []
        return response;
    } catch (error) {
        // Log error
    }
}

export const getSensorLastReading = async (sensorId: string) => {
    try {
        // Make request
        const response = await serverRequest("sensor", "getSensorLastReading", [sensorId]);
        if (!response.ok) return undefined
        return response;
    } catch (error) {
        // Log error
    }
}

// export const getSensorStatus = async (sensorId: string) => {
//     try {
//         // Make request
//         const response = await serverRequest("sensor", "getSensorStatus", [sensorId]);
//         if (!response.ok) return undefined
//         return response;
//     } catch (error) {
//         // Log error
//     }
// }