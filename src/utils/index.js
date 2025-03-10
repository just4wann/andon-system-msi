import os from 'os';

export function getIPAddress() {
    const networkIP = os.networkInterfaces();
    const { address } = networkIP["Wi-Fi"].filter((content) => content.family === "IPv4")[0];

    return address;
}