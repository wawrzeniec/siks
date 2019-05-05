const { spawn } = require('child_process');
const { spawnSync } = require('child_process');

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
        catch (error) {
            callback({status: 500, reason: "Error parsing JSON response from getquote.py", err: data.toString('utf-8')});
        }
    });

    cmd.stderr.on('data', (data) => {
        try { 
            callback(JSON.parse(data.toString('utf8')))
        }
        catch (error) {
            callback({status: 500, reason: "Error parsing JSON response from getquote.py", err: data.toString('utf-8')});
        }
    });
}

function updateNew(dbname) {
    // This checks if there are new assets that have not been tracked yet, and tracks them if so
    const command = 'python'; 
    console.log('Checking for new securities...');
    const cmd = spawnSync(command, ['checknew.py', dbname], { cwd: './python' });
    return cmd;
}

module.exports = {
    getQuote,
    updateNew
};

