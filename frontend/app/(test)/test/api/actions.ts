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

    const requestDataObject = JSON.parse(requestData); // Parse JSON string to object
    const valuesArray = Object.values(requestDataObject); // Get values from object as array
    const response = await serverRequest(endpointKey, selectedEndpoint, valuesArray);
    return JSON.stringify(response.data); // Assuming response needs to be converted to string for display

};