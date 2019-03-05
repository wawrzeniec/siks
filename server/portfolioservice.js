
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

module.exports = {
    getPortfolios
};