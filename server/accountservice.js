
function getAccounts(db, session, callback) {
    let stmt = 'SELECT accountid, name FROM accounts WHERE userid=$id';
    db.all(stmt, {
        $id: session.userid
        }, (err, rows) => {
            if (err) {
                return callback({
                    status: 500,
                    reason: "Failed to query accounts from DB"
                });
            }
            else {
                return callback({
                    status: 200,
                    data: rows
                })
            }
        }
    );
}

module.exports = {
    getAccounts
};