import { Utils } from './utils.js';

const utils = new Utils();

const port = 8001;
const ip = '192.168.100.98';

utils.onMounted(() => {
  utils.websocketListenerStart(ip, port);
  utils.dateAndTime();
});

setInterval(() => {
  utils.dateAndTime();
}, 60000);
