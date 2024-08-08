'use server'
import { serverRequest } from "@/app/lib/api/request"
import { IGroupCreationForm } from "./types"


export const getGroups = async () => {
    try {
        // Make request
        const response = await serverRequest("group", "getGroups", []);
        return response;
    } catch (error) {
        // Log error
    }
}

export const createGroup = async (fields: IGroupCreationForm) => {
    try {
        // Get fields
        const name = fields.name;
        const location = fields.location;
        const description = fields.description;
        // Make request
        const response = await serverRequest("group", "createGroup", [name, location, description]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const editGroup = async (groupId: number, fields: IGroupCreationForm) => {
    try {
        // Get fields
        const name = fields.name;
        const location = fields.location;
        const description = fields.description;
        // Make request
        const response = await serverRequest("group", "editGroup", [groupId, name, location, description]);
        return response;
    }
    catch (error) {
        // Log error
    }
}

export const deleteGroup = async (groupId: number) => {
    try {
        // Make request
        const response = await serverRequest("group", "deleteGroup", [groupId]);
        return response;
    } catch (error) {
        // Log error
    }
}

export const getSummary = async () => {
    try {
        // Make request
        const response = await serverRequest("dashboard", "getSummary", []);
        return response;
    } catch (error) {
        // Log error
    }
}

export const getCurrentWeather = async () => {
    try {
        // Make request
        const response = await serverRequest("weather", "getCurrentWeather", []);
        return response;
    } catch (error) {
        // Log error
    }
}

export const getForecastWeather = async () => {
    try {
        // Make request
        const response = await serverRequest("weather", "getForecastWeather", []);
        return response;
    } catch (error) {
        // Log error
    }
}