// This script initializes the db for siks. 
// It only creates the siksconfig.db database which 
// contains the user info and the global preferences

const sqlite3 = require('sqlite3').verbose();

function displayerr(err) {
  if (err) {
    if (err.status)
      console.log('Error:\nstatus: ' + err.status +'\nreason: ' + err.reason + '\nmessage: ' + err.message);
    else
      console.log('Error: ' + err.message)
    process.exit(1);
  }
  else 
  console.log('OK!');
} 

let configdb = new sqlite3.Database('./db/siksdb.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, displayerr);
console.log('Connected to siksdb.db');
createDB(configdb, displayerr)
console.log('Done! Closing db...');
configdb.close(displayerr);

console.log('Exiting (0)');


function createDB(db, callback) 
{
  // Adds the cred table
  console.log('Adding table userprefs...');
  let stmt = `CREATE TABLE userprefs (
    userid INTEGER UNIQUE PRIMARY KEY, 
    username TEXT UNIQUE NOT NULL, 
    hash TEXT NOT NULL,
    firstname TEXT,
    lastname TEXT,
    emailaddress TEXT,
    target INTEGER,
    monthlyreport INTEGER,
    errorreport INTEGER
    )`; 

    db.run(stmt, [], (err) => {
    if (err) {  
    return callback( {
        status: 'error',
        reason: 'failed to create userprefs table',
        message: err.message
      });
    }
  });

  // Adds the prefs table
  console.log('Adding table config...'); 
  stmt = `CREATE TABLE config (
    id INTEGER UNIQUE PRIMARY KEY,
    currentuser INTEGER,
    FOREIGN KEY(currentuser) REFERENCES userprefs(userid)
    )`;
  db.run(stmt, [], (err) => {
    if (err) {  
    return callback( {
        status: 'error',
        reason: 'failed to create config table',
        message: err.message
      });
    }
  });

  // Adds the 'types' table
  console.log('Adding table types...');
  stmt = `CREATE TABLE types (
    typeid INTEGER PRIMARY KEY,
    typename TEXT NOT NULL,
    userid INTEGER, 
    FOREIGN KEY(userid) REFERENCES userprefs(userid)
    )`;
  db.run(stmt, [], (err) => {
    if (err) {  
    return callback( {
        status: 'error',
        reason: 'failed to create types table',
        message: err.message
      });
    }
  });

  // Adds the 'categories' table
  console.log('Adding table categories...');
  stmt = `CREATE TABLE categories (
    categoryid INTEGER PRIMARY KEY, 
    categoryname TEXT NOT NULL,
    userid INTEGER,
    FOREIGN KEY(userid) REFERENCES userprefs(userid)
    )`;
  db.run(stmt, [], (err) => {
    if (err) {  
    return callback( {
        status: 'error',
        reason: 'failed to create categories table',
        message: err.message
      });
    }
  });

  // Adds the 'markets' table
  console.log('Adding table markets...');
  stmt = `CREATE TABLE markets (
    marketid INTEGER PRIMARY KEY,
    marketname TEXT NOT NULL,
    userid INTEGER,
    FOREIGN KEY(userid) REFERENCES userprefs(userid)
    )`;
  db.run(stmt, [], (err) => {
    if (err) {  
    return callback( {
        status: 'error',
        reason: 'failed to create markets table',
        message: err.message
      });
    }
  });

  stmt = `CREATE TABLE securities (
    securityid INTEGER,
    identifier TEXT,
    type INTEGER,
    category INTEGER,
    market INTEGER,
    currency TEXT,
    methods TEXT,
    annualfee REAL,
    userid INTEGER,
    FOREIGN KEY(type) REFERENCES types(typeid),
    FOREIGN KEY(category) REFERENCES categories(categoryid),
    FOREIGN KEY(market) REFERENCES markets(marketid),
    FOREIGN KEY(userid) REFERENCES userprefs(userid)
    )`;
  db.run(stmt, [], (err) => {
    if (err) {  
      return callback( {
        status: 'error',
        reason: 'failed to create securities table',
        message: err.message
      });
    }
  });

  stmt = `CREATE TABLE investments (
    investmentid INTEGER UNIQUE PRIMARY KEY,
    securityid INTEGER,
    date TEXT,
    number REAL,
    value REAL,
    pricepaid REAL,
    FOREIGN KEY(securityid) REFERENCES securities(securityid)
    )`;
  db.run(stmt, [], (err) => {
    if (err) {  
      return callback( {
        status: 'error',
        reason: 'failed to create investments table',
        message: err.message
      });
    }
  });

  stmt = `CREATE TABLE history (
    securityid INTEGER,
    timestamp TEXT,
    value REAL,
    chfvalue REAL,
    FOREIGN KEY(securityid) REFERENCES securities(securityid)
    )`;
  db.run(stmt, [], (err) => {
    if (err) {  
      return callback( {
        status: 'error',
        reason: 'failed to create history table',
        message: err.message
      });
    }
  });
}
