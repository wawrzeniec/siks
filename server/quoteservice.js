const { spawn } = require('child_process');

function getQuote(query, callback) {
    const method = query.method;
    const ticker = query.ticker;

    const command = 'python'; 
    console.log('Getting quote for ' + ticker + ' using method ' + method);
    const cmd = spawn(command, ['./python/getquote.py', method, ticker]);

    cmd.stdout.on('data', (data) => {
        try {
            callback(JSON.parse(data.toString('utf8')))
        }
        catch {
            callback({status: 500, reason: "Error parsing JSON response from getquote.py", err: data.toString('utf-8')});
        }
    });

    cmd.stderr.on('data', (data) => {
        try { 
            callback(JSON.parse(data.toString('utf8')))
        }
        catch {
            callback({status: 500, reason: "Error parsing JSON response from getquote.py", err: data.toString('utf-8')});
        }
    });
}

module.exports = {
    getQuote
};

