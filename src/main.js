import express from 'express';
import path from 'path';
import { fileURLToPath } from "url";

import { Router } from './routes/router.js';
import { TCPGateway } from './services/TCPGateway/index.js';
import { WebsocketGateway } from './services/WebsocketGateway/index.js';
import { getIPAddress } from './utils/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const port = 3000;
const ip = getIPAddress();
const router = new Router(app);
const websocket = new WebsocketGateway(8001);
const tcp = new TCPGateway(websocket);

websocket.createServer();
tcp.connect(8000);
router.setupRouter();

app.listen(port, ip, () => {
    console.log(`server listen on ${ip}:${port}`);
})
