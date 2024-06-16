'use server'
import { serverRequest } from "@/app/lib/api/request"
import { IGroupCreationForm } from "./types"
import { revalidateTag } from "next/cache"


export const getGroups = async () => {
    try {
        // Make request
        const response = await serverRequest("group", "getGroups", []);
        if (response.ok) revalidateTag("getGroups");
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
        if (response.ok) revalidateTag("createGroup");
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
        if (response.ok) revalidateTag("editGroup");
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
        if (response.ok) revalidateTag("deleteGroup");
        return response;
    } catch (error) {
        // Log error
    }
}

export const getSummary = async () => {
    try {
        // Make request
        const response = await serverRequest("dashboard", "getSummary", []);
        if (response.ok) revalidateTag("getSummary");
        return response;
    } catch (error) {
        // Log error
    }
}