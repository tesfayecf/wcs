'use server'
import { serverRequest } from "@/app/lib/api/request";
import { Tank } from "./tank/[tankId]/types";

// Group
export const getGroup = async (groupId: number) => {
    try {
        // Make request
        const response = await serverRequest("group", "getGroup", {
            id: groupId
        });
        return response;
    } catch (error) {
        // Log error
    }
}

// TANK
export const getTanks = async (groupId: number) => {
    try {
        // Make request
        const response = await serverRequest("tank", "getTanks", {
            group: groupId
        });
        return response;
    } catch (error) {
        // Log error
    }
}

export const createTank = async (fields: Tank.ITankCreationForm, groupId: number) => {
    try {
        // Get fields
        const name = fields.name;
        const type = fields.type;
        const capacity = fields.capacity;
        // Make request
        const response = await serverRequest("tank", "createTank", {
            name: name,
            type: type,
            capacity: capacity,
            description: "",
            group: groupId
        });
        return response;
    } catch (error) {
        // Log error
    }
}

export const editTank = async (tankId: number, groupId: number, fields: Tank.ITankCreationForm) => {
    try {
        // Get fields
        const name = fields.name;
        const type = fields.type;
        const capacity = fields.capacity;
        const isActive = true;
        // Make request
        const response = await serverRequest("tank", "updateTank", {
            id: tankId,
            group: groupId,
            name: name,
            type: type,
            capacity: capacity,
            is_active: isActive
        });
        return response;
    } catch (error) {
        // Log error
    }
}

// export const deleteTank = async (tankId: number, groupId: number) => {
//     try {
//         // Make request
//         const response = await serverRequest("tank", "deleteTank", [tankId, groupId]);
//         return response;
//     } catch (error) {
//         // Log error
//     }
// }

// SENSOR
// export const getSensor = async (tankId: number, groupId: number) => {
//     try {
//         const response = await serverRequest("sensor", "sensor", [tankId, groupId]);
//         return response;
//     } catch (error) {
//         // Log error
//     }
// }

// export const createSensor = async (fields: ISensorCreationForm, tankId: number, groupId: number) => {
//     try {
//         // Get fields
//         const sensorId = fields.sensorId;
//         // Make request
//         const response = await serverRequest("sensor", "createSensor", [sensorId, tankId, groupId]);
//         return response;
//     } catch (error) {
//         // Log error
//     }
// }

// export const editSensor = async (id, tankId, groupId, fields: ISensorCreationForm) => {
//     try {
//         // Get fields
//         const sensorId = fields.sensorId;
//         const isActive = true;
//         // Make request
//         const response = await serverRequest("sensor", "editSensor", [id, sensorId, isActive, tankId, groupId]);
//         return response;
//     } catch (error) {
//         // Log error
//     }
// }

// export const deleteSensor = async (sensorId: number, tankId: number, groupId: number) => {
//     try {
//         // Make request
//         const response = await serverRequest("sensor", "deleteSensor", [sensorId, tankId, groupId]);
//         return response
//     } catch (error) {
//         // Log error
//     }
// }


// export const getSensorReadings = async (sensorId: string) => {
//     try {
//         // Make request
//         const response = await serverRequest("sensor", "getSensorReadings", [sensorId]);
//         if (!response.ok) return []
//         return response;
//     } catch (error) {
//         // Log error
//     }
// }

// export const getSensorLastReading = async (sensorId: string) => {
//     try {
//         // Make request
//         const response = await serverRequest("sensor", "getSensorLastReading", [sensorId]);
//         if (!response.ok) return undefined
//         return response;
//     } catch (error) {
//         // Log error
//     }
// }

// // export const getSensorStatus = async (sensorId: string) => {
// //     try {
// //         // Make request
// //         const response = await serverRequest("sensor", "getSensorStatus", [sensorId]);
// //         if (!response.ok) return undefined
// //         return response;
// //     } catch (error) {
// //         // Log error
// //     }
// // }