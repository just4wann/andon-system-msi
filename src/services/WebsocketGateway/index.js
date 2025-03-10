import { WebSocket, WebSocketServer } from "ws";

export class WebsocketGateway {
    constructor(port, hostname) {
        this.wss = new WebSocketServer({ 
            port: port, 
            host: hostname
        });
        this.clients = new Set();
    }

    createServer() {
        this.wss.on('connection', (ws) => {
            this.clients.add(ws);
        })
    }

    sendPayload(payload) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                if (client != null) {
                    client.send(JSON.stringify(payload));
                }
            }
        })
    }

    getPayload() {
        let payload = '';
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                if (client != null) {
                    client.on('message', (message) => {
                        payload = message.toString();
                    })
                }
            }
        })
        return payload;
    }
}