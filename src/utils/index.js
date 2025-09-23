import os from 'os';

export function getIPAddress() {
    const networkIP = os.networkInterfaces();
    let address;

    if (networkIP["Ethernet 2"]) address = networkIP["Ethernet 2"].filter((content) => content.family === "IPv4")[0].address;
    else if (networkIP["Wi-Fi"]) address = networkIP["Wi-Fi"].filter((content) => content.family === "IPv4")[0].address;

    return address;
}