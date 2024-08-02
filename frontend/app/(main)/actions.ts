'use server'
import { serverRequest } from "../lib/api/request";

export const getUserInfo = async () => { return await serverRequest("user", "getUserInfo", []); }