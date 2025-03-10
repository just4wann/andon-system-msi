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
  }

  websocketListenerStart(hostname, port) {
    const websocket = new WebSocket(`ws://${hostname}:${port}`);

    websocket.addEventListener('message', (message) => {
      const payload = JSON.parse(message.data);
      const data = JSON.parse(payload.payload);

      if (data === true) {
        if (payload.item == 'disconnected' || payload.item == 'error') {
          this.tcpErrorElement.classList.remove("none");
        }
        else if (payload.item == 'connected') {
          this.tcpErrorElement.classList.add("none");
        }
        return;
      }
      
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

  async dateAndTime() {
    const response = await fetch('http://192.168.100.98:3000/api/getTime', {
      method: 'GET',
    });
    const { time, date } = await response.json();
    const [ hour, minute ] = time.split('.');
    this.timeElement.innerHTML = `${hour}.${minute}`;
    this.dateElement.innerHTML = date;
  }
}
