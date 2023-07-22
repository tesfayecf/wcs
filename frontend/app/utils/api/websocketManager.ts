import { store } from "../store/store";
import BaseManager from "./baseManager";



class WebSocketManager extends BaseManager {
    private static instance: WebSocketManager;
    private constructor() {
        super();
        console.log("WebSocketManager constructor");
    }

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        console.log("WebSocketManager getInstance()");
        return WebSocketManager.instance;
    }

    private async initWS_(path: string): Promise<WebSocket> {
        const url = `${this.WS_PROT}://${this.BASE_URL}:${this.PORT}/${path}`;
        const ws = new WebSocket(url, []);

        await new Promise((resolve, reject) => {
            ws.onopen = () => {
                resolve(ws);
            };
            ws.onerror = (event) => {
                reject(event);
            };
        });

        return ws;
    }

    public async initWS(): Promise<void> {
        const ws = await this.initWS_("ws/sensor_data/");
        this.ws_api = ws;
    }

    public async sendWebSocketData(data: any): Promise<void> {
        if (this.ws_api.readyState === WebSocket.OPEN) {
            this.ws_api.send(JSON.stringify(data));
        }
    }

    public async receiveWebSocketData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ws_api.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("receiveWebSocketData", data);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            this.ws_api.onerror = (event) => {
                reject(event);
            };
        });
    }
}

export default WebSocketManager;