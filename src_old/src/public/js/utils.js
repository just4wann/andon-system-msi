export class Utils {
  constructor() {
    this.specElement = document.querySelector('.spec');
    this.nextElement = document.querySelector('.next');
    this.colorElement = document.querySelector('.color-spec');
    this.planElement = document.querySelector('.plan');
    this.resultElement = document.querySelector('.result');
    this.statusElement = document.querySelector('.status');

    const parentElement = document.querySelector('.rubber');
    this.rubbersElement = parentElement.querySelectorAll('span');

    this.serverErrorElement = document.querySelector('.server');
    this.tcpErrorElement = document.querySelector('.tcp');

    this.payloadConnectionType = ['closed', 'error'];
  }

  websocketListenerStart(hostname, port) {
    const websocket = new WebSocket(`ws://${hostname}:${port}`);

    websocket.addEventListener('message', async (message) => {
      if (this.payloadConnectionType.includes(message.data)) return this.tcpErrorElement.classList.remove('none');

      this.tcpErrorElement.classList.add('none');
      const data = this.getParsingResult(message.data);

      this.specElement.innerHTML = data[0];
      this.nextElement.innerHTML = data[1];

      for (let i = 0; i < data[2].length; i++) {
        if (!data[2][i].isMatch) {
          this.rubbersElement[i].style.color = 'red';
        } else {
          this.rubbersElement[i].style.color = 'yellow';
        }
        this.rubbersElement[i].innerHTML = data[2][i].name;
      }

      this.planElement.innerHTML = data[3];
      this.resultElement.innerHTML = data[4];
      this.colorElement.style.backgroundColor = data[5];

      data[6] === 1 ? (this.statusElement.style.backgroundColor = 'yellow') : (this.statusElement.style.backgroundColor = 'red');
    });
  }

  onMounted(callback) {
    document.addEventListener('DOMContentLoaded', () => {
      callback();
    });
  }

  getParsingResult(string) {
    const remove = string.slice(7, string.length);

    const spec = this.getSpec(remove);
    const next = this.getNext(remove);
    const rubber = this.getRubbers(remove);
    const { plan, result } = this.getPlanResult(remove);
    const color = this.getColor(remove);
    const line = this.getStatusLine(remove);

    return [spec, next, rubber, plan, result, color, line];
  }

  getSpec(arr) {
    const split = arr.split('/');
    const getLastStr = split[1].slice(0, -4);
    const result = split[0].concat('/', getLastStr);
    return result;
  }

  getNext(arr) {
    const split = arr.split('/');
    const getFirstStr = split[1].slice(-3);
    const delLastStr = split[2].slice(0, -5);
    const result = getFirstStr.concat('/', delLastStr);
    return result;
  }

  getRubbers(arr) {
    const split = arr.split('2/');
    let arrTemp = [];
    for (let i = split[0].length - 1; i > 0; i--) {
      if (arrTemp.length == 4) break;
      arrTemp.unshift(split[0][i]);
    }
    let result = [];
    const firstRubber = arrTemp.join('');
    const secondRubber = split[1];
    const thirdRubber = split[2];
    const fourthRubber = split[3];
    const fifthRubber = split[4];

    const listRubbers = [firstRubber, secondRubber, thirdRubber, fourthRubber, fifthRubber];
    for (let i = 0; i < listRubbers.length; i++) {
      if (listRubbers[i][0] === '1') {
        result.push({
          name: listRubbers[i].slice(1, listRubbers[i].length),
          isMatch: false,
        });
      } else {
        result.push({
          name: listRubbers[i].slice(1, listRubbers[i].length),
          isMatch: true,
        });
      }
    }
    return result;
  }

  getPlanResult(arr) {
    const strArr = arr.split('2/2');
    const trim = strArr[strArr.length - 1].replace(/\s+/g, '');
    const plan = trim[0];
    const result = trim[2];

    return { plan, result };
  }

  getColor(arr) {
    const split = arr.split('/');
    const strLists = split[split.length - 1].slice(-13).slice(0, -1);
    let colorStatuses = [];
    for (let i = 0; i < 6; i++) {
      if (strLists[i + (i + 1)] == ' ') {
        colorStatuses.push(false);
      } else {
        colorStatuses.push(true);
      }
    }

    let countNoColor = 0;
    for (let i = 0; i < colorStatuses.length; i++) {
      if (colorStatuses[i] === false) countNoColor++;
    }
    if (countNoColor === 6) return 'black';
    if (colorStatuses[0]) return 'red';
    if (colorStatuses[1]) return 'yellow';
    if (colorStatuses[2]) return 'orange';
    if (colorStatuses[3]) return 'blue';
    if (colorStatuses[4]) return 'white';
    if (colorStatuses[5]) return 'green';
  }

  getStatusLine(arr) {
    const split = arr.split('/');
    const str = split[split.length - 1].slice(0, -13).slice(-3);
    return str[str.length - 1] === '2' ? 0 : 1;
  }
}