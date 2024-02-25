'use server'
import { serverRequest } from "../lib/api/server";

export const getUserInfo = async () => { 'use server'; return await serverRequest("user", "getUserInfo", []); }

export const getGroups = async () => { 'use server'; return await serverRequest("group", "getGroups", []); }

export const getTanks = async (groupId: string) => { 'use server'; return await serverRequest("tank", "getTanks", [groupId]); }