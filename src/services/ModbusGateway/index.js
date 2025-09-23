import net from 'net';

export class ModbusGateway {
    constructor(ws) {
        this.socket = new net.Socket();
        this.ws = ws;
        this.status = false;

        this.socket.on('connect', () => {
            console.log('connected')
        })

        this.socket.on('connectionAttemptFailed', () => {
            this.status = false;
            console.log('connect failed');
        })

        this.socket.on('error', (error) => {
            this.status = false
            console.log(error)
        })
    }

    connect(host, port) {
        this.socket.connect({ host, port }, () => {
            this.status = true;
        });
    }

    reconnect() {
        this.connect('127.0.0.1', 502);
    }

    parsingResponseBuffer(buffer) {
        let arr = [];
        for (let i = 0; i < (buffer[8] / 2); i++) {
            for (let j = (0 * i); j < (2 * i); j++) {
                console.log(buffer[buffer.length - j]);
            }
            console.log(`loop ke : ${i + 1}`);
        }
        buffer.forEach((val, index) => {
            if (index == buffer.length - 2 || index == buffer.length - 1) arr.push(val);
        })

        const result = (arr[0] << 8) | arr[1];
        return result;
    }

    sendRequestBuffer(buffer) {
        if (this.socket.destroyed) this.reconnect()
        if (!this.status) return;
        return new Promise((resolve, reject) => {
            this.socket.write(buffer)

            this.socket.once('data', (buff) => {
                const data = this.parsingResponseBuffer(buff);
                this.ws.sendPayload(data);
                this.socket.end();
                resolve(data);
            })

            this.socket.once('error', (err) => {
                console.error(err);
                this.ws.sendPayload(err)
                this.socket.end();
                reject(err);
                return;
            })
        })
    }

    async readHoldingRegister(startingAddress, quantity) {
        const requestBuffer = Buffer.from([
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x06,
            0x01,
            0x03,
            0x00,
            startingAddress,
            0x00,
            quantity
        ])

        try {
            const data = await this.sendRequestBuffer(requestBuffer);
            return data;
        } catch (error) {
            console.error(error);
        }
    }
}