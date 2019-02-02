const { spawn } = require('child_process');

function getQuote(query, callback) {
    const method = query.method;
    const ticker = query.ticker;

    const command = 'python'; 
    console.log('Getting quote for ' + ticker + ' using method ' + method);
    const cmd = spawn(command, ['./python/getquote.py', method, ticker]);

    cmd.stdout.on('data', (data) => {
        callback(JSON.parse(data.toString('utf8')))
    });

    cmd.stderr.on('data', (data) => {
        callback(JSON.parse(data.toString('utf8')))
    });
}

module.exports = {
    getQuote
};

