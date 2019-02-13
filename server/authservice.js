const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const scm = require('./server-config');

const ServerConfig = new scm();
const saltRounds = ServerConfig.saltRounds; // Number of rounds to generate salt for passwords
console.log(saltRounds);

function login(db, params, callback) {    
    const username = params.userName;
    const password = params.password;
    let stmt = 'SELECT ROWID, hash FROM usercred WHERE username=$username';
    db.get(stmt, {
        $username: username, 
    },
    (err, row) => {
        if (err) {
            console.log('error')
            return callback({
                status: 500,
                reason: 'Failed to retrieve user info from database',
                err: err
            });                        
        }
        else
        {
            console.log(row);
            if (row) {
                bcrypt.compare(password, row['hash'], (err, res) => {
                    if (err) {
                        return callback ({
                            status: 500,
                            reason: 'Failed while checking password',
                            err: err
                        });
                    }
                    else {
                        if (res) {
                            return callback({
                                status: 200,
                                data: row['rowid']
                            }); 
                        }
                        else{                            
                            return callback ({
                                status: 401,
                                reason: 'User name or password is incorrect',
                                err: err
                            });
                        }
                    }
                });
            }
            else {
                return callback({
                    status: 401,
                    reason: 'User name or password is incorrect',
                    err: err
                }); 
            }
        }
    });
}

function checkSession(session, callback)
{
    console.log(session);
    if (session.loggedin) {        
        return callback({
        status: 200,
        });
    }
    else {
        return callback({
            status: 401,
            reason: 'Session invalid',
        });
    }
}

module.exports = {
    login,
    checkSession
};