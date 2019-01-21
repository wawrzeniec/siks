const sqlite3 = require('sqlite3');

const configdb = new sqlite3.Database('db/siksconfig.db');

let stmt = 'SELECT * from cred';
configdb.all(stmt, [], (err, rows) => {
	if (err) {
		console.log('Error: ');
		throw err;
	}
	rows? rows.foreach( (row) => {console.log(row)} ) : console.log('Table cred is empty');
});

configdb.close( (err) => {
	console.log('Error closing the DB: ');
	throw err;
});
