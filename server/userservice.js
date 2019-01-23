const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds to generate salt for passwords

// Creates a new user in the database
function createUser(db, username, emailaddress, password, callback) {    
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return callback ({
                status: 500,
                reason: 'Failed to hash password',
                err: err
            });
        }
        else {
            console.log('username: ' + username + '\nhash: ' + hash + '\nemail: ' + emailaddress);
            // If hash suceeded, insert into the database
            let stmt = 'INSERT INTO userprefs (username, hash, emailaddress) values ($username, $hash, $email)';
            db.run(stmt, {
                $username: username, 
                $hash: hash,
                $email: emailaddress},
                (err) => {
                    if (err) {
                        return callback({
                            status: 500,
                            reason: 'failed to write user credentials into database',
                            err: err
                        });
                    }
                });
            }
        });
    }

function checkUserExists(db, username, callback) {
    let stmt = 'SELECT * FROM userprefs WHERE username=$username';	
	db.get(stmt, {$username: username}, (err, row) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'sqlite error',
                err: err
            });
        }
        else if (row) {
            return callback({
                status: 409,
                reason: 'User already exists'
            });
        }
        else
        {
            return callback ({
                status: 200
            });
        }
    });
}

module.exports = {createUser, checkUserExists};
                

