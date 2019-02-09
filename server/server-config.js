// server-config.js
// configuration options for the node API server

class ServerConfig  {
    
    constructor() { 
    this.port = 8000;
    this.https = true;
    this.saltRounds = 10;
    }
};


module.exports = ServerConfig