import axios, { AxiosInstance } from "axios";


class BaseManager {
    public HTTP_PROT = "http";
    public WS_PROT = "ws";
    public BASE_URL = "127.0.0.1";
    public PORT = 8000;
    protected request_api: AxiosInstance;
    protected ws_api: WebSocket;

    constructor() {
        this.request_api = this.initApi();
    }

    private initApi() {
        return axios.create({
            baseURL: `${this.HTTP_PROT}://${this.BASE_URL}:${this.PORT}`,
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