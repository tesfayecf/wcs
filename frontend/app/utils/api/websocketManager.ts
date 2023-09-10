import { store } from '../store/store';
import BaseManager from './baseManager';

class WebSocketManager extends BaseManager {
    private static instance: WebSocketManager;
    private wsConnections: {
        [connection: string]: {
            websocket: WebSocket
            endpoint: string
            properties: any
        }
    } = {};

    private constructor() {
        super();
        console.log("WebSocketManager constructor");
    }

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    private async initWS_(path: string): Promise<WebSocket> {
        const access_token = store.getState().app.auth.accesToken;
        const url = `${this.WS_PROT}://${this.BASE_URL}:${this.PORT}/${path}?token=${access_token}`;
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

    public async initWS(endpoint: string): Promise<void> {
        if (!this.wsConnections[`${endpoint}_conn`]) {
            const ws = await this.initWS_("ws/sensor_data/");
            this.wsConnections[`${endpoint}_conn`] = {
                endpoint: endpoint,
                websocket: ws,
                properties: {}
            };
        }
    }

    public async sendWebSocketData(endpoint: string, data: any): Promise<void> {
        const ws = this.wsConnections[`${endpoint}_conn`].websocket;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    public async receiveWebSocketData(endpoint: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const ws = this.wsConnections[`${endpoint}_conn`].websocket;
            if (!ws) {
                reject(new Error(`WebSocket connection for endpoint ${endpoint} not found.`));
                return;
            }

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("receiveWebSocketData", data);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            ws.onerror = (event) => {
                reject(event);
            };
        });
    }
}

export default WebSocketManager;
