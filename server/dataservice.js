const sqlite3 = require('sqlite3');

function getSummary(db, callback) {
    console.log('Getting summary');

    const stmt = `
    SELECT identifier, number, intrinsicvalue, currency, intrinsicvalue*currencyvalue AS chfvalue, securityid, typeid, typename FROM (
    SELECT * FROM (
    SELECT * FROM (
    SELECT * FROM (
    SELECT securityid, number, number*value AS intrinsicvalue FROM 
    (SELECT securityid, SUM(number) AS number FROM investments GROUP BY securityid) 
    JOIN (SELECT securityid, value, MAX(timestamp) FROM history GROUP BY securityid) USING(securityid))
    JOIN (SELECT securityid, identifier, currency, typeid FROM securities) USING (securityid))
    JOIN (SELECT securityid AS currencyid, currency FROM securities WHERE typeid=1) USING(currency))
    JOIN (SELECT securityid AS currencyid, value AS currencyvalue, MAX(timestamp) AS timestamp FROM history GROUP BY securityid) USING(currencyid))
    JOIN types USING (typeid)`

    db.all(stmt, (err, rows) => {
        if (err) {
            return callback({
                status: 500,
                reASon: 'failed to get summary FROM DB',
                err: err
            });
        }
        else {
            data = {
                total: 0,
                identifier: [],
                securityid: [],
                number: [],
                value: [],
                currency: [],
                typeid: [],
                typename: []
            }
            for (d in rows) {
                if (rows[d].typeid == 1) {
                    data.total += rows[d].intrinsicvalue;
                    data.value.push(rows[d].intrinsicvalue);
                }
                else {
                    data.total += rows[d].chfvalue;
                    data.value.push(rows[d].chfvalue);
                }
                data.identifier.push(rows[d].identifier);
                data.securityid.push(rows[d].securityid);
                data.number.push(rows[d].number);     
                data.typeid.push(rows[d].typeid);
                data.typename.push(rows[d].typename);
                data.currency.push(rows[d].currency)
            }
            console.log(data);
            return callback({
                status: 200,
                data: data
            })
        }
    });

}

module.exports = {
    getSummary
}