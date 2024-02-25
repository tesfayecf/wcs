'use client'
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Select, MenuItem } from "@mui/material";
import { apiInterface } from "@/app/lib/api/interface";
import ContentBox from "@/app/components/contentBox/ContentBox";
import RequestManager from "@/app/lib/api/requestManager";
import { handleSendRequest } from "./actions";

const requestManager = RequestManager.getInstance();

interface IApiProps { }

const Api: React.FunctionComponent<IApiProps> = (props: IApiProps) => {
    const [endpoints, setEndpoints] = useState([]);
    const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
    const [selectedEndpointInfo, setSelectedEndpointInfo] = useState<any>(null); // State to hold endpoint details
    const [requestData, setRequestData] = useState<string>("{}");
    const [responseData, setResponseData] = useState<string>("");

    useEffect(() => {
        getEndpoints();
    }, []);

    const getEndpoints = () => {
        let endpoints = [];
        Object.keys(apiInterface).forEach((endpointKey) => {
            Object.keys(apiInterface[endpointKey]).forEach((endpoint) => {
                endpoints.push({
                    key: endpoint,
                    address: apiInterface[endpointKey][endpoint].address,
                    argKeys: apiInterface[endpointKey][endpoint].argsKeys,
                });
            });
        });
        setEndpoints(endpoints);
    };

    const getEndpointDetails = (endpoint: string) => {
        setSelectedEndpoint(endpoint as string);
        const foundEndpoint = endpoints.find((item) => item.key === endpoint);
        setSelectedEndpointInfo(foundEndpoint);
    };


    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ContentBox>
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "20px" }}>
                    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between", margin: "20px" }}>
                        <div>
                            <Select
                                value={selectedEndpoint}
                                onChange={(e) => { getEndpointDetails(e.target.value as string) }}
                                style={{ height: "50px", width: "400px", marginRight: "10px" }}
                            >
                                {endpoints.map((endpoint) => (
                                    <MenuItem key={endpoint.key} value={endpoint.key}>
                                        {endpoint.key}
                                    </MenuItem>
                                ))}
                            </Select>
                            {selectedEndpointInfo && (
                                <div>
                                    <h4>Address: {selectedEndpointInfo.address}</h4>
                                    <h4>Argument Keys: {selectedEndpointInfo.argKeys.join(", ")}</h4>
                                </div>
                            )}
                        </div>
                        <TextField
                            multiline
                            rows={5}
                            variant="outlined"
                            label="Request JSON Data"
                            value={requestData}
                            onChange={(e) => setRequestData(e.target.value)}
                            style={{ width: "60%" }}
                        />
                    </div>
                    <Button variant="contained" color="primary" onClick={async () => {
                        const data = await handleSendRequest(selectedEndpoint, requestData);
                        setResponseData(data);
                    }}>
                        Send Request
                    </Button>
                    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between", margin: "20px" }}>
                        <Typography variant="h6">Response from Server:</Typography>
                        <TextField
                            multiline
                            rows={5}
                            variant="outlined"
                            value={responseData}
                            aria-readonly
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>
            </ContentBox>
        </div>
    );
};

export default Api;
