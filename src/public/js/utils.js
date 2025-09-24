export class Utils {
  constructor() {
    // this.timeElement = document.querySelector('.time');
    // this.dateElement = document.querySelector('.date');
    this.specElement = document.querySelector('.spec');
    this.nextElement = document.querySelector('.next');
    this.rubberElement = document.querySelector('.rubber');
    this.colorElement = document.querySelector('.color-spec');
    this.planElement = document.querySelector('.plan');
    this.resultElement = document.querySelector('.result');
    this.statusElement = document.querySelector('.status');

    this.serverErrorElement = document.querySelector('.server');
    this.tcpErrorElement = document.querySelector('.tcp');

    this.payloadConnectionType = ["closed", "error"];
  }

  websocketListenerStart(hostname, port) {
    const websocket = new WebSocket(`ws://${hostname}:${port}`);

    websocket.addEventListener('message', async (message) => {
      if (this.payloadConnectionType.includes(message.data))
        return this.tcpErrorElement.classList.remove("none");

      this.tcpErrorElement.classList.add("none");
      const data = this.getParsingResult(message.data);

      this.specElement.innerHTML = data[0];
      this.nextElement.innerHTML = data[1];
      this.rubberElement.innerHTML = data[2];
      this.planElement.innerHTML = data[3];
      this.resultElement.innerHTML = data[4];
      this.colorElement.style.backgroundColor = data[5];

      data[6] == '1' ?
        this.statusElement.style.backgroundColor = 'yellow' : this.statusElement.style.backgroundColor = 'red'
    });
  }

  onMounted(callback) {
    document.addEventListener('DOMContentLoaded', () => {
      callback();
    });
  }

  getTime() {
    // this.timeElement.innerHTML = new Date().toLocaleTimeString('id-ID', { hour12: false });
    // this.dateElement.innerHTML = new Date().toLocaleDateString('id-ID');
  }

  getParsingResult(string) {
    const remove = string.slice(4, string.length);
    const spec = this.getSpec(remove);
    const next = this.getNext(remove);
    const rubber = this.getRubber(remove);
    const { plan, result } = this.getPlanResult(remove);
    const { hexColor, status } = this.getColorStatus(remove);

    return [ spec, next, rubber, plan, result, hexColor, status ];
  }

  getSpec(arr) {
    const spec = arr.split(" ");
    let str1 = '';
    let str2 = '';
    for (let i = 1; i < spec[0].length; i++) {
      str1 += spec[0][i]
    }
    str1 += '/'
    for (let i = 0; i < spec[2].length; i++) {
      if (spec[2][i] == '2') break;
      str2 += spec[2][i];
    }
    const result = str1.concat(spec[1], str2);
    return result;
  }

  getNext(arr) {
    const next = arr.split(" ");
    let str1 = '';
    let str2 = '';
    for (let i = 3; i < next[2].length; i++) {
      str1 += next[2][i]
    }
    str1 += '/'
    for (let i = 0; i < next[4].length; i++) {
      if (next[4][i] == '2') break;
      str2 += next[4][i];
    }
    const result = str1.concat(next[3], str2);
    return result;
  }

  getRubber(arr) {
    const rubbStr = arr.split("2/2");
    let temp = []
    for (let i = rubbStr[0].length - 1; i > 0; i--) {
      if (rubbStr[0][i] === '2' && temp.length === 3) break;
      temp.unshift(rubbStr[0][i]);
    }
    const firstRubber = temp.join('')
    rubbStr.shift();
    let rubbers = [firstRubber];
    for (let i = 0; i < rubbStr.length - 1; i++) {
      rubbers.push(rubbStr[i]);
    }
    const rubber = rubbers.join(" / ");
    return rubber;
  }

  getPlanResult(arr) {
    const strArr = arr.split("2/2");
    const trim = strArr[strArr.length - 1].replace(/\s+/g, "");
    const plan = trim[0];
    const result = trim[2];

    return { plan, result };
  }

  getColorStatus(arr) {
    const split = arr.split('2/2');
    const trim = split[split.length - 1].replace(/\s+/g, "");
    let hexColor = '#';
    for (let i = 5; i < trim.length - 3; i++) {
      hexColor += trim[i].charCodeAt(0).toString(16);
    }
    
    return { hexColor, status: trim[4] }
  }
}
