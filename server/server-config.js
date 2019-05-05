// server-config.js
// configuration options for the node API server

class ServerConfig  {

    constructor() {
    this.port = 8000;
    this.https = true;
    this.saltRounds = 10;
    this.ip = '192.168.1.27';
    this.port = 8000;
    this.ssid = 'Swisscheese';
    this.domain = 'siks.duckdns.org';
    }
};


module.exports = ServerConfig
