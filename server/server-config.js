// server-config.js
// configuration options for the node API server

class ServerConfig  {

    constructor() {
    this.port = 8000;
    this.https = true;
    this.saltRounds = 10;
    this.ip = '192.168.1.116';
    this.port = 8000;
    this.ssid = 'Swisscheese';
    this.domain = 'siks.duckdns.org';
    this.routerbssid = "38:35:fb:46:b0:fc";
    }
};


module.exports = ServerConfig
