const sqlite3 = require('sqlite3');
const paramService = require('./paramservice');

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
            console.log(result);
            let typeid = result.data.typeid;
            console.log(typeid);
            paramService.getCategoryId(db, typeid, security.category, (result) => {
                if (result.status != 200) {
                    return callback(result);
                }
                else {
                    // Gets the market ids
                    console.log(result);
                    let categoryid = result.data.categoryid;
                    console.log(categoryid);
                    paramService.getMarketIds(db, typeid, security.markets, (result) => {
                        if (result.status != 200) {
                            console.log(result);
                            return callback(result);
                        }
                        else {
                            // Finally we insert the row in the securities table here
                            console.log(result);
                            let marketids = [];
                            result.data.forEach( (v, i) => {
                                marketids.push(v.marketid);
                            });
                            console.log(JSON.stringify(marketids));
                            console.log(JSON.stringify(security.methods));
                            console.log({
                                $identifier: security.identifier,
                                $typeid: typeid,
                                $categoryid: categoryid,
                                $marketid: JSON.stringify(marketids),
                                $currency: security.currency,
                                $methods: JSON.stringify(security.methods),
                                $watch: security.watch ? 1 : 0
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

module.exports = {
    addSecurity
};