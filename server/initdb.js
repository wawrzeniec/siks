// This script initializes the db for siks. 
// It only creates the siksconfig.db database which 
// contains the user info and the global preferences

const sqlite3 = require('sqlite3').verbose();

function displayerr(err) {
  if (err) {
    console.log('Error: ' + err.message);
    process.exit(1);
  }
  else 
  console.log('OK!');
} 

let configdb = new sqlite3.Database('./db/siksconfig.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, displayerr);
console.log('Connected to siksconfig.db');

// Adds the cred table
console.log('Adding table cred...');
let stmt = `CREATE TABLE cred (
  id INTEGER UNIQUE PRIMARY KEY, 
  username TEXT UNIQUE NOT NULL, 
  hash TEXT NOT NULL)`; 
configdb.run(stmt, [], displayerr);

// Adds the prefs table
console.log('Adding table config...'); 
stmt = 'CREATE TABLE config (currentuser INTEGER)';
configdb.run(stmt, [], displayerr);

// Adds the 'types' table
console.log('Adding table types...');
stmt = `CREATE TABLE types (
  typeid INTEGER PRIMARY KEY,
  typename TEXT NOT NULL)`;
configdb.run(stmt, [], displayerr);

// Adds the 'categories' table
console.log('Adding table categories...');
stmt = `CREATE TABLE categories (
  categoryid INTEGER PRIMARY KEY, 
  categoryname TEXT NOT NULL)`;
configdb.run(stmt, [], displayerr);

// Adds the 'markets' table
console.log('Adding table markets...');
stmt = `CREATE TABLE markets (
  marketid INTEGER PRIMARY KEY,
  marketname TEXT NOT NULL)`;
configdb.run(stmt, [], displayerr);

console.log('Done! Closing db...');
configdb.close(displayerr);

console.log('Exiting (0)');
