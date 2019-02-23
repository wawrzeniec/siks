const sqlite3 = require('sqlite3');
const paramService = require('./paramservice');

const assetsModule = require('./assets/assets')

function addSecurity(db, security, callback) {
    console.log('Adding security');
    console.log(security);

    // Here there is a few things we need to do
    // * category: convert to categoryid
    // * markets: convert to al list of marketids
    // * and then insert into table
    //
    // we might want to create convenience methods in configservice to handle
    // the conversion to ids

    // First queries the type ID
    paramService.getTypeId(db, security.type, (result) => {
        // If error, display error, else proceed to next query
        if (result.status != 200) {
            return callback(result);
        }
        else {
            // Gets the category id
            let typeid = result.data.typeid;
            paramService.getCategoryId(db, typeid, security.category, (result) => {
                if (result.status != 200) {
                    return callback(result);
                }
                else {
                    // Gets the market ids
                    let categoryid = result.data.categoryid;
                    paramService.getMarketIds(db, typeid, security.markets, (result) => {
                        if (result.status != 200) {
                            console.log(result);
                            return callback(result);
                        }
                        else {
                            // Finally we insert the row in the securities table here
                            let marketids = [];
                            result.data.forEach( (v, i) => {
                                marketids.push(v.marketid);
                            });
                            let stmt = 'INSERT INTO securities (identifier, typeid, categoryid, marketids, currency, methods, watch) VALUES ($identifier, $typeid, $categoryid, $marketid, $currency, $methods, $watch)';
                            db.run(stmt, {
                                $identifier: security.identifier,
                                $typeid: typeid,
                                $categoryid: categoryid,
                                $marketid: JSON.stringify(marketids),
                                $currency: security.currency,
                                $methods: JSON.stringify(security.methods),
                                $watch: security.watch ? 1 : 0
                                },
                                (err) => {
                                    if (err) {
                                        return callback({
                                            status: 500,
                                            reason: 'failed to add security into database',
                                            err: err
                                        });
                                    }
                                    else {
                                        return callback({
                                            status: 200
                                        });
                                    }
                                }
                            );
                        }
                    });
                }
            });
        }
    });
}

function addAsset(db, session, asset, callback) {
    // This adds an asset to the 'investments' table
    // It also checks whether the asset's currency is already in the securities table
    // If not, it adds it automatically.

    console.log('Adding asset');
    console.log(asset);

    // If it is a currency, the id will be the currency name

    getSecurityId(db, session, asset, (securityId, err) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'Failed to add asset ' + asset,
                err: err
            });
        }
        else {
            let stmt = 'INSERT INTO investments (securityid, date, number, price, currency, comment, userid) VALUES ($id, $date, $number, $price, $currency, $comment, $userid)';
            db.run(stmt, {
                $id: securityId,
                $date: asset.date,
                $number: asset.number,
                $price: asset.price,
                $currency: asset.currency,
                $comment: asset.comment,
                $userid: session.userid
                },
                (err) => {
                    if (err) {
                        return callback({
                            status: 500,
                            reason: 'failed to add asset into database: ' + asset,
                            err: err
                        });
                    }
                    else {
                        if (asset.price > 0 && asset.deduct) {
                            return deductCurrency(db, session, asset, callback)
                        }
                        else {
                            return callback({
                                status: 200
                            });
                        }
                    }
                }
            );
        }
    });
}

function getSecurityId(db, session, asset, callback) {
    console.log('Getting securityid')
    if (asset.type == 'Cash') {
        console.log('Type is Cash: ' + asset.id)
        // If cash, we need to first find out the securiyid of the currency.
        // If it doesn't exist we need to add it
        let stmt = 'SELECT securityid FROM securities WHERE typeid=1 AND currency=$currency'
        db.get(stmt, {
            $currency: asset.id
        }, (err, rows) => {
            if (err) {
                console.log('Error occurred')
                console.log(err)
                return callback(null, err)
            }
            else {
                // If the response is empty, we need to add the currency
                // else we can just return the callback with id
                if (rows) {
                    return callback(rows.securityid, null)
                }
                else {
                    // We need to insert the currency as an asset
                    return insertNewCurrency(db, session, asset.id, callback)
                }
            }
        });
    }
    else {
        // If not, we can just go on with asset.id
        console.log('Type is not cash')
        return callback(asset.id, null);
    }
}

function insertNewCurrency(db, session, currency, callback) {
    console.log('Inserting new currency ' + currency)
    const curmethods = assetsModule.makeDefaultCurrencyWatch(currency);
    var curlist = {};
    for (c in assetsModule.currencyList) {
        curlist[assetsModule.currencyList[c].symbol] = assetsModule.currencyList[c].name
    }
    let identifier = curlist[currency]
    console.log('Found identifier = ' + identifier);
    console.log('Inserting w/ methods:');
    console.log(curmethods);
    let stmt = 'INSERT INTO securities (identifier, typeid, currency, methods, watch, userid) VALUES ($id, 1, $cur, $methods, 1, $userid)';
    db.run(stmt, {
        $id: identifier,
        $cur: currency,
        $methods: JSON.stringify(curmethods),
        $userid: session.userid
    }, function (err) {
        if (err) {
            return callback(null, err)
         }
         else {
            console.log(this)
            return callback(this.lastID, null)
         }
    });
}

function deductCurrency(db, session, asset, callback) {
    // Deducing is like adding a new negative investment =>
    // We create an investment and call addAsset() on it
    console.log('Deducting ' + asset.price + ' ' + asset.currency + ' from assets');

    makeDeductionComment(db, asset, (comment, err) => {
        if (err) {
            return callback({
                status: 500,
                reason: 'Failed to make deduction comment for asset: ' + JSON.stringify(asset),
                err: err
            });
        }
        else {
            let negAsset = {
                comment: comment,
                currency: asset.currency,
                date: asset.date,
                deduct: false,
                id: asset.currency,
                number: -asset.price,
                type: 'Cash'
            };
            return addAsset(db, session, negAsset, callback)
        }
    });
}

function makeDeductionComment(db, asset, callback) {
    if (asset.type == 'Cash') {
        let comment = 'Paid for ' + asset.number + ' ' + asset.id + ' on ' + asset.date;
        return callback(comment, null);
    }
    else {
        // We first get the security identifier
        let stmt = 'SELECT identifier FROM securities WHERE securityid=$id';
        db.get(stmt, {
            $id: asset.id
        }, (err, row) => {
            if (err) {
                console.log('ERROR')
                return callback(null, err);
            }
            else {
                console.log('NO ERROR');
                console.log(row)
                let comment = 'Paid for ' + asset.number + ' units of ' + row.identifier + ' on ' + asset.date;
                return callback(comment, null);
            }
        });
    }
}


module.exports = {
    addSecurity,
    addAsset,
};