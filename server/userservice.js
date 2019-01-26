const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds to generate salt for passwords

// Get the list of users in the database
function getUsers(db, callback) {
    let stmt = 'SELECT userid, username from userprefs';
    db.all(stmt, (err, rows) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'failed to query users from database',
                err: err
            });
        }
        else {
            return callback({
                status: 200, 
                data: rows
            });
        }
    });
}

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

function getUserDetails(db, username, callback) {
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
                status: 200,
                data: row
            });
        }
        else
        {
            return callback ({
                status: 404,
                reason: 'User does not exist'
            });
        }
    });
}


module.exports = {
    createUser, 
    checkUserExists, 
    getUsers,
    getUserDetails,
    checkUserExists};
                

