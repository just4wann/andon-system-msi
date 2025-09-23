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
      const data = this.parsingHexData(message.data);

      this.specElement.innerHTML = data[0];
      this.nextElement.innerHTML = data[1];
      this.rubberElement.innerHTML = data[2];
      this.planElement.innerHTML = data[3];
      this.resultElement.innerHTML = data[4];

      // this.colorElement.style.backgroundColor = data.colorSpec;
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
    // get SPEC and NEXT
    const { spec, next } = this.getSpecNext(remove);

    // get RUBBER
    const rubber = this.getRubber(remove);

    //get PLAN and RESULT
    const { plan, result } = this.getPlanResult(remove);

    return [ spec, next, rubber, plan, result ];
  }

  getSpecNext(arr) {
    const specNext = arr.split("2");
    const spec = specNext[1];
    const next = specNext[2];
    return { spec, next };
  }

  getRubber(arr) {
    const rubbStr = arr.split(" ");
    let str = ''
    for (let i = 4; i < rubbStr.length; i++) {
      str += rubbStr[i];
      if ( i == 10 ) break;
    }
    const rubStrGet = str.slice(3, str.length);
    const rubberArr = rubStrGet.split("2/2");
    const rubber = rubberArr.join(" / ");
    return rubber;
  }

  getPlanResult(arr) {
    const strArr = arr.split(" ");
    let str = '';
    for (let i = 12; i < strArr.length; i++) {
      str += strArr[i];
      if ( i == 14 ) break;
    }
    const planResStrGet = str.slice(0, str.length - 1);
    const planResArr = planResStrGet.split("2");
    const plan = planResArr[0];
    const result = planResArr[1];

    return { plan, result };
  }
}
