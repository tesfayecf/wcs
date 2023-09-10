import { store } from "../store/store";
import BaseManager from "./baseManager";


class WebSocketManager2 extends BaseManager {
    private static instance: WebSocketManager2;
    private connections: Map<string, WebSocket>;
    private reconnectAttempts: Map<string, number>;
    private throttleDelay: number;
    private debouncedProcessing: any;
    private debounceDelay: number;
    private throttleSending: boolean;

    constructor() {
        super();
        this.connections = new Map();
        this.reconnectAttempts = new Map();
        this.throttleDelay = 500; // Throttle messages to be sent every 500ms
        this.debouncedProcessing = null;
        this.debounceDelay = 500; // Debounce processing of received messages every 1000ms
        this.throttleSending = false;
    }

    public static getInstance(): WebSocketManager2 {
        if (!WebSocketManager2.instance) {
            WebSocketManager2.instance = new WebSocketManager2();
        }
        return WebSocketManager2.instance;
    }

    public connect(sensorId, onConnectionCallback, onMessageCallback, onErrorCallback) {
        if (this.connections.has(sensorId)) {
            console.warn(`WebSocket connection for sensor ID ${sensorId} already exists.`);
            return;
        }

        const endpoint = this.constructEndpoint(sensorId);
        const socket = new WebSocket(endpoint, []);

        socket.onopen = (event) => {
            console.log(`WebSocket connection for sensor ID ${sensorId} established.`);
            this.connections.set(sensorId, socket);

            const message = {
                sensor_id: sensorId,
                timestamp: Date.now(),
                message: "sensor_id_initial_connection"
            }

            this.sendMessage(sensorId, JSON.stringify(message))

            onConnectionCallback(event);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            onMessageCallback(message, sensorId);
        };

        socket.onerror = (error) => {
            console.error(`WebSocket connection error for sensor ID ${sensorId}:`, error);
            onErrorCallback(error);
        };
    }

    public close(sensorId) {
        const socket = this.connections.get(sensorId);
        if (socket) {
            socket.close();
            console.log(`WebSocket connection for sensor ID ${sensorId} closed.`);
            this.connections.delete(sensorId);
        } else {
            console.warn(`WebSocket connection for sensor ID ${sensorId} not found.`);
        }
    }

    public closeAll() {
        this.connections.forEach((socket, sensorId) => {
            socket.close();
            console.log(`WebSocket connection for sensor ID ${sensorId} closed.`);
        });
        this.connections.clear();
    }


    public monitorConnectionHealth(sensorId) {
        const socket = this.connections.get(sensorId);
        if (!socket) {
            console.warn(`WebSocket connection for sensor ID ${sensorId} not found.`);
            return;
        }

        const heartbeatInterval = setInterval(() => {
            // Send a heartbeat message to the server
            socket.send("heartbeat");
        }, 5000); // 5 seconds interval

        // Clear the heartbeatInterval when the connection is closed
        socket.addEventListener("close", () => {
            clearInterval(heartbeatInterval);
        });
    }


    public reconnect(sensorId) {
        const maxReconnectAttempts = 10;
        const baseReconnectInterval = 1000; // 1 second

        let reconnectInterval = this.reconnectAttempts.get(sensorId) || baseReconnectInterval;

        if (reconnectInterval > baseReconnectInterval * 10) {
            // Maximum backoff time reached, reset the interval
            reconnectInterval = baseReconnectInterval;
            this.reconnectAttempts.set(sensorId, reconnectInterval);
        }

        if (this.reconnectAttempts.get(sensorId) >= maxReconnectAttempts) {
            console.warn(`Maximum reconnection attempts reached for sensor ID ${sensorId}.`);
            return;
        }

        console.log(`Attempting to reconnect for sensor ID ${sensorId} in ${reconnectInterval}ms.`);
        setTimeout(() => {
            this.connect(sensorId, () => { }, () => { }, () => { });
            reconnectInterval *= 2; // Exponential backoff: Double the reconnect interval
            reconnectInterval += Math.random() * 500; // Add random jitter up to 0.5 seconds
            this.reconnectAttempts.set(sensorId, reconnectInterval);
        }, reconnectInterval);
    }


    public sendMessage(sensorId, message) {
        const connection = this.connections.get(sensorId);
        if (connection && connection.readyState === WebSocket.OPEN) {
            connection.send(message);
        } else {
            console.error(`WebSocket connection for sensor ID ${sensorId} is not open.`);
        }
    }

    // Throttle sending messages
    public throttleSendMessage(sensorId, message) {
        if (!this.throttleSending) {
            this.sendMessage(sensorId, message);
            this.throttleSending = true;
            setTimeout(() => {
                this.throttleSending = false;
            }, this.throttleDelay);
        }
    }


    public debounceMessageProcessing(message) {
        if (!this.debouncedProcessing) {
            this.debouncedProcessing = setTimeout(() => {
                this.processReceivedMessage(message);
                this.debouncedProcessing = null;
            }, this.debounceDelay);
        }
    }


    public processReceivedMessage(message) {
        // Handle the received message
        console.log("Received message:", message);
        // Add your processing logic here
    }

    private constructEndpoint(sensorId: string) {
        const access_token = store.getState().app.auth.accesToken;
        const url = `${this.WS_PROT}://${this.BASE_URL}:${this.PORT}/ws/sensor_data/?token=${access_token}`;
        console.log("Constructed endpoint:", url);
        return url;
    }

    public dispose() {
        // Close all active WebSocket connections
        this.closeAll();

        // Clean up any other resources or timers here, if necessary
        // For example, you might want to clear the reconnectAttempts map and other variables.
        this.reconnectAttempts.clear();

        // Clear the debounced processing timer, if it is active
        if (this.debouncedProcessing) {
            clearTimeout(this.debouncedProcessing);
            this.debouncedProcessing = null;
        }
    }
}

export default WebSocketManager2;
