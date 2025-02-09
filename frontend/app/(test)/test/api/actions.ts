'use server'

import { apiInterface } from "@/app/lib/api/interface";
import { serverRequest } from "@/app/lib/api/request";

export const handleSendRequest = async (selectedEndpoint, requestData) => {
    // Find the endpoint key
    let endpointKey = null;
    for (const key in apiInterface) {
        if (apiInterface[key].hasOwnProperty(selectedEndpoint)) {
            endpointKey = key;
            break;
        }
    }

    // Parse JSON string to object
    const requestDataObject = JSON.parse(requestData); 

    // Send request
    const response = await serverRequest(endpointKey, selectedEndpoint, requestDataObject);
    return JSON.stringify(response.data); // Assuming response needs to be converted to string for display
};