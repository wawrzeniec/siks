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

function getTypeId(db, typename, callback) {
    let stmt = 'SELECT typeid FROM types WHERE typename=$typename';
    db.get(stmt, {
            $typename: typename
        },
        (err, rows) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'failed to query typeid for type ' + typename,
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

function getCategoryId(db, typeid, categoryname, callback) {
    let stmt = 'SELECT categoryid FROM categories WHERE categoryname=$categoryname AND typeid=$typeid';
    db.get(stmt, {
            $categoryname: categoryname,
            $typeid: typeid
        },
        (err, rows) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'failed to query categoryid for category [' + categoryname + '] and typeid ' + typeid,
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

function getMarketIds(db, typeid, marketnames, callback) {
    let stmt = 'SELECT marketid FROM markets WHERE typeid=$typeid AND marketname IN (';
    let params = {$typeid: typeid};
    marketnames.forEach( (name, i) => {
        if (i>0) {
            stmt += ', ';
        }        
        stmt += '$name'+i;
        params['$name'+i] = name;  
    });
    stmt += ')';
    console.log(stmt);
    console.log(params)
    //let stmt = 'SELECT marketid FROM markets WHERE typeid=$typeid AND marketname IN ("America","Europe")';    
    //let fmarketnames = marketnames.length === 0 ? '' : '"' + marketnames.join('","') + '"';
    //console.log(fmarketnames);
    db.all(stmt, params,
        (err, rows) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'failed to query marketids for markets [' + marketnames + '] and typeid ' + typeid,
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

function getSecurities(db, params, callback) {
    
    let stmt = 'SELECT * from securities';
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
                reason: 'failed to query list of securities from database',
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
    getTypeId,
    getCategories,
    getCategoryId,
    getMarkets,
    getMarketIds,
    getSecurities
};