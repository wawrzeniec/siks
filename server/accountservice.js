
function getAccounts(db, session, callback) {
    let stmt = 'SELECT accountid, name, portfolioid FROM accounts WHERE userid=$id';
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


function createAccount(db, session, accountspec, callback) {
    console.log(accountspec.name);
    console.log(session.userid);
    let stmt = 'INSERT into accounts (name, userid) VALUES ($name, $userid)';
    db.all(stmt, {
        $name: accountspec.name,
        $userid: session.userid
        }, (err, rows) => {
            if (err) {
                console.log(err);
                return callback({
                    status: 500,
                    reason: "Failed to add account to DB"
                });
            }
            else {
                return callback({
                    status: 200,
                });
            }
        }
    );
}


module.exports = {
    getAccounts,
    createAccount
};