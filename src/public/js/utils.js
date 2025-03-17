export class Utils {
  constructor() {
    this.timeElement = document.querySelector('.time');
    this.dateElement = document.querySelector('.date');
    this.specElement = document.querySelector('.spec');
    this.nextElement = document.querySelector('.next');
    this.rubberElement = document.querySelector('.rubber');
    this.colorElement = document.querySelector('.color-spec');
    this.planElement = document.querySelector('.plan');
    this.resultElement = document.querySelector('.result');

    this.serverErrorElement = document.querySelector('.server');
    this.tcpErrorElement = document.querySelector('.tcp');

    this.payloadConnectionType = ["connected", "disconnected", "error"];
  }

  websocketListenerStart(hostname, port) {
    const websocket = new WebSocket(`ws://${hostname}:${port}`);

    websocket.addEventListener('message', (message) => {
      if (this.payloadConnectionType.includes(message.data)) {
        if (message.data == 'disconnected' || message.data == 'error') {
          this.tcpErrorElement.classList.remove("none");
        }
        else if (message.data == 'connected') {
          this.tcpErrorElement.classList.add("none");
        }
        return;
      }

      const data = JSON.parse(message.data)

      this.specElement.innerHTML = data.specs;
      this.nextElement.innerHTML = data.next;
      this.rubberElement.innerHTML = data.rubber;
      this.colorElement.style.backgroundColor = data.colorSpec;
      this.planElement.innerHTML = data.plan;
      this.resultElement.innerHTML = data.result;
    });
  }

  onMounted(callback) {
    document.addEventListener('DOMContentLoaded', () => {
      callback();
    });
  }

  getTime() {
    this.timeElement.innerHTML = new Date().toLocaleTimeString('id-ID', { hour12: false });
    this.dateElement.innerHTML = new Date().toLocaleDateString('id-ID');
  }
}
