'use server'
import { serverRequest } from "../lib/api/server";

export const getUserInfo = async () => { return await serverRequest("user", "getUserInfo", []); }

