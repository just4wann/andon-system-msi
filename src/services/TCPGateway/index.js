import net from 'net';

export class TCPGateway {
  constructor(ws) {
    this.server = net.createServer();
    this.ws = ws;
  }

  listen(port) {
    this.server.listen(port, () => {
      console.log(`TCP Server Listen on Port ${port}`);
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

  126;
  126;
  68;
  94;
  50;
  49;
  56;
  53;
  47;
  54;
  48;
  82;
  49;
  52;
  72;
  32;
  48;
  52;
  76;
  72;
  52;
  49;
  32;
  76;
  66;
  50;
  49;
  56;
  53;
  47;
  54;
  53;
  82;
  49;
  52;
  72;
  32;
  48;
  52;
  76;
  72;
  52;
  49;
  32;
  76;
  66;
  50;
  80;
  53;
  48;
  50;
  47;
  50;
  85;
  51;
  51;
  50;
  47;
  50;
  83;
  50;
  53;
  50;
  47;
  50;
  32;
  32;
  32;
  50;
  47;
  50;
  32;
  32;
  32;
  50;
  47;
  50;
  32;
  32;
  51;
  50;
  32;
  32;
  51;
  50;
  49;
  32;
  49;
  32;
  49;
  32;
  49;
  32;
  49;
  32;
  49;
  32;
  42;
}
