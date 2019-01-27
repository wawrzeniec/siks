const sqlite3 = require('sqlite3');

// Gets the list of security types
function getTypes(db, params, callback) {
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

function getCategories(db, params, callback) {
    let stmt = 'SELECT * from categories';
    let par = {};

    // Filter on types
    if (params.hasOwnProperty('type')) {
        stmt += ' JOIN types USING(typeid) WHERE typename=$type';
        par['$type'] = params.type;
    }

    db.all(stmt, par, (err, rows) => {
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

function getMarkets(db, params, callback) {
    
    let stmt = 'SELECT * from markets';
    let par = {};

    // Filter on types
    if (params.hasOwnProperty('type')) {
        stmt += ' JOIN types USING(typeid) WHERE typename=$type';
        par['$type'] = params.type;
    }

    db.all(stmt, par, (err, rows) => {
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