const sqlite3 = require('sqlite3');

// Gets the list of security types
function getTypes(db, callback) {
    let stmt = 'SELECT * from types';
    db.all(stmt, (err, rows) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'failed to query types from database',
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

function getCategories(db, callback) {
    let stmt = 'SELECT * from categories';
    db.all(stmt, (err, rows) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'failed to query categories from database',
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

function getMarkets(db, callback) {
    let stmt = 'SELECT * from markets';
    db.all(stmt, (err, rows) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'failed to query markets from database',
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

module.exports = {
    getTypes,
    getCategories,
    getMarkets
};