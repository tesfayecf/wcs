import axios, { AxiosInstance } from "axios";


class BaseManager {
    public HTTP_PROT = "http";
    public WS_PROT = "ws";
    public BASE_URL = "localhost";
    public PORT = 3000;
    protected request_api: AxiosInstance;
    protected ws_api: WebSocket;

    constructor() {
        this.request_api = this.initApi();
    }

    private initApi() {
        return axios.create({
            // baseURL: `${this.HTTP_PROT}://${this.BASE_URL}:${this.PORT}`,
            baseURL: ".",
            withCredentials: true,
            headers: {
                common: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            },
        });
    }
}

export default BaseManager;


/** 
 * Now i want to implement a robust and efficient websocket connection manager. 
 * It has to handle multiple connections at the same time do so efficently and orginized. 
 * To start a connection we must pass the token id of the sensor we want to receive the data from. 
 * Then the manager will construct the endpoint with this data. We should also pass the callback functions for on message received and and error. 
 * Based on this instruction implement a websocket manager that behaves like this. You must add more functionalities and options to include. 
 * You should also find the best way to manage multiple connections at the same time and be able to track them and be aware of the. 
 * Also implement a way to close all connections and other things. Implement algorithms and mathematics to handle the connections and make the user wait as little as possible. 
 * Use the built in WebSocket implementatin of javascript. 
 * Take into account that you are a senior and experimented programmer that has a lot of experience building client side tools to make connections more efficient and reliable
 */