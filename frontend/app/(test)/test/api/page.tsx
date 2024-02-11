'use client'
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/utils/store/store";
import { TextField, Button, Typography, Select, MenuItem } from "@mui/material";
import { APIInterface } from "@/app/utils/api/apiInterface";
import ContentBox from "@/app/components/contentBox/ContentBox";
import RequestManager from "@/app/utils/api/requestManager";

const requestManager = RequestManager.getInstance();

interface IApiProps extends ReturnType<typeof mapStateToProps> { }

const Api: React.FunctionComponent<IApiProps> = (props: IApiProps) => {
    const [endpoints, setEndpoints] = useState([]);
    const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
    const [selectedEndpointInfo, setSelectedEndpointInfo] = useState<any>(null); // State to hold endpoint details
    const [requestData, setRequestData] = useState<string>("");
    const [responseData, setResponseData] = useState<string>("");

    useEffect(() => {
        getEndpoints();
    }, []);

    const getEndpoints = () => {
        let endpoints = [];
        Object.keys(APIInterface).forEach((endpointKey) => {
            Object.keys(APIInterface[endpointKey]).forEach((endpoint) => {
                endpoints.push({
                    key: endpoint,
                    address: APIInterface[endpointKey][endpoint].address,
                    argKeys: APIInterface[endpointKey][endpoint].argsKeys,
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


    const handleSendRequest = async () => {
        try {

            // Find the endpoint key
            let endpointKey = null;
            for (const key in APIInterface) {
                if (APIInterface[key].hasOwnProperty(selectedEndpoint)) {
                    endpointKey = key;
                    break;
                }
            }

            const requestDataObject = JSON.parse(requestData); // Parse JSON string to object
            const valuesArray = Object.values(requestDataObject); // Get values from object as array

            const response = await requestManager.request(endpointKey, selectedEndpoint, valuesArray);
            setResponseData(JSON.stringify(response.data)); // Assuming response needs to be converted to string for display
        } catch (error) {
            console.error("Error sending request:", error);
            setResponseData("Error occurred while sending request"); // Set error message in case of failure
        }
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
                    <Button variant="contained" color="primary" onClick={handleSendRequest}>
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

function mapStateToProps(state: IRootState) {
    return {};
}

export default connect(mapStateToProps, {})(Api);
