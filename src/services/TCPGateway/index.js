import net from 'net';
import EventEmitter from 'events';

export class TCPGateway extends EventEmitter {
    constructor(ws) {
        super();
        this.socket = new net.Socket();
        this.ws = ws;

        this.setupListeners();
    }

    connect(port, host) {
        this.socket.connect({ port: port, host: host });
    }

    reconnect() {
        setTimeout(() => {
           this.connect(8000)
        }, 3000);
    }

    disconnect() {
        this.socket.destroy();
    }

    setupListeners() {
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('data', this.onData.bind(this));
        this.socket.on('close', this.onClose.bind(this));
        this.socket.on('error', this.onError.bind(this));
    }

    onConnect() {
        this.ws.sendPayload({
            item: 'connected',
            payload: true
        })
    }

    onData(data) {
        this.ws.sendPayload({
            item: 'data',
            payload: data.toString()
        })
    }

    onClose() {
        this.ws.sendPayload({
            item: 'disconnected',
            payload: true
        })
        this.reconnect();
    }

    onError(error) {
        this.ws.sendPayload({
            item: 'error',
            payload: true
        })
    }
}