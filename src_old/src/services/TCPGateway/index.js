import net from 'net';

export class TCPGateway {
  constructor(ws) {
    this.server = net.createServer();
    this.ws = ws;
  }

  listen(port, host) {
    this.server.listen(port, host, () => {
      console.log(`TCP Server Listen on ${host}:${port}`);
    });

    this.server.on('connection', (socket) => {
      console.log('client connected');
      socket.on('data', this.onData.bind(this));
      socket.on('error', this.onError.bind(this));
      socket.on('close', this.onClose.bind(this));
    });
  }

  onClose() {
    this.ws.sendPayload('closed');
  }

  onError(err) {
    console.error('Error : ', err);
    this.ws.sendPayload('error');
  }

  onData(buffer) {
    this.ws.sendPayload(buffer.toString());
  }
}
