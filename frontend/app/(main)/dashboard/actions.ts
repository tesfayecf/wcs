'use server'

import { serverRequest } from "@/app/lib/api/server"
import { IGroupCreationForm } from "./types"
import { revalidateTag } from "next/cache"


export const getGroups = async () => { return await serverRequest("group", "getGroups", []); }


export const createGroup = async (fields: IGroupCreationForm) => {
    try {
        // Get fields
        const name = fields.name
        const location = fields.location
        const description = fields.description

        const response = await serverRequest("group", "createGroup", [name, location, description]);
        if (response.ok) {
            revalidateTag("createGroup")
        }

        return response;
    } catch (error) {
        // Log error
    }
}

export const editGroup = async (groupId: number, fields: IGroupCreationForm) => {
    try {
        // Get fields
        const name = fields.name
        const location = fields.location
        const description = fields.description

        const response = await serverRequest("group", "editGroup", [groupId, name, location, description]);
        if (response.ok) {
            revalidateTag("editGroup")
        }
    }
    catch (error) {
        // Log error
    }
}

export const deleteGroup = async (groupId: number) => {
    try {
        const response = await serverRequest("group", "deleteGroup", [groupId]);
        if (response.ok) {
            revalidateTag("deleteGroup")
        }
    } catch (error) {
        // Log error
    }
}