import { Utils } from './utils.js';

const utils = new Utils();

const port = 8001;
const ip = '192.168.100.155';

utils.onMounted(() => {
  utils.websocketListenerStart(ip, port);
});

setInterval(() => {
  utils.getTime();
}, 1000)
