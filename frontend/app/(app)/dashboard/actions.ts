'use server'
import { serverRequest } from "@/app/lib/api/request"
import { Group } from "../group/[groupId]/types";
import { Api } from "@/app/lib/api/types";

export const createGroup = async (fields: Group.IGroupForm) => {
    try {
        // Get fields
        const name = fields.name;
        const location = fields.location;
        const description = fields.description;
        // Make request
        const response = await serverRequest("group", "createGroup", {
            name: name,
            location: location,
            description: description,
        });
        return response;
    } catch (error) {
        // Log error
    }
}

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

export const getGroups = async () => {
    try {
        // Make request
        const response = await serverRequest("group", "getGroups", {});
        return response;
    } catch (error) {
        // Log error
    }
}

export const editGroup = async (groupId: number, fields: Group.IGroupForm) => {
    try {
        // Get fields
        const name = fields.name;
        const location = fields.location;
        const description = fields.description;
        // Make request
        const response = await serverRequest("group", "updateGroup", {
            id: groupId,
            name: name,
            location: location,
            description: description
        });
        return response;
    }
    catch (error) {
        // Log error
    }
}

export const deleteGroup = async (groupId: number) => {
    try {
        // Make request
        const response = await serverRequest("group", "deleteGroup", {
            id: groupId
        });
        return response;
    } catch (error) {
        // Log error
    }
}

export const getGroupRecords = async (groupId: number, startTime: string, endTime: string, timeframe: Api.Timeseries.TimeframeChoiceEnum) => {
    try {
        // Make request
        const response = await serverRequest("timeseries", "getRecords", {
            tank_id: undefined,
            group_id: groupId,
            start_time: startTime,
            end_time: endTime,
            timeframe: timeframe,
        });
        return response;
    } catch (error) {
        // Log error
    }
}

export const getGroupRecordsFlow = async (groupId: number, startTime: string, endTime: string, timeframe: Api.Timeseries.TimeframeChoiceEnum) => {
    try {
        // Make request
        const response = await serverRequest("timeseries", "getRecordsFlow", {
            tank_id: undefined,
            group_id: groupId,
            start_time: startTime,
            end_time: endTime,
            timeframe: timeframe
        });
        return response;
    } catch (error) {
        // Log error
    }
}

export const getCurrentWeather = async () => {
    try {
        // Make request
        const response = await serverRequest("weather", "getCurrentWeather", {
            city_name: "Girona"
        });
        return response;
    } catch (error) {
        // Log error
    }
}

export const getForecastWeather = async () => {
    try {
        // Make request
        const response = await serverRequest("weather", "getForecastWeather", {
            city_name: "Girona"
        });
        return response;
    } catch (error) {
        // Log error
    }
}