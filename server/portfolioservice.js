
function getPortfolios(db, session, callback) {
    let stmt = 'SELECT portfolioid, name FROM portfolios WHERE userid=$id';
    db.all(stmt, {
        $id: session.userid
        }, (err, rows) => {
            if (err) {
                return callback({
                    status: 500,
                    reason: "Failed to query portfolios from DB"
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

function createPortfolio(db, session, accountspec, callback) {
    console.log(accountspec.name);
    console.log(session.userid);
    let stmt = 'INSERT into portfolios (name, userid) VALUES ($name, $userid)';
    db.all(stmt, {
        $name: accountspec.name,
        $userid: session.userid
        }, (err, rows) => {
            if (err) {
                console.log(err);
                return callback({
                    status: 500,
                    reason: "Failed to add portfolio to DB"
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
    getPortfolios,
    createPortfolio
};