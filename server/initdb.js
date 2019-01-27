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
configdb.serialize();
console.log('Connected to siksdb.db');
createDB(configdb, displayerr);
console.log('Done! Closing db...');
//configdb.close(displayerr);

console.log('Exiting (0)');


function createDB(db, callback) 
{
  const dbdefaults = require('./dbdefaults');   

  // Adds the cred table
  console.log('Adding table usercred...');
  let stmt = `CREATE TABLE usercred (
    username TEXT UNIQUE NOT NULL, 
    hash TEXT NOT NULL
    )`;

    db.run(stmt, [], (err) => {
    if (err) {  
    return callback( {
        status: 'error',
        reason: 'failed to create usercred table',
        message: err.message
      });
    }
    // Adds the default users
    for (user in dbdefaults.defaultusers) {
      console.log('Adding default user "' + dbdefaults.defaultusers[user].username + '"');
      stmt = `INSERT INTO usercred (username, hash) VALUES
        ($username, $hash)`;   
        db.run(stmt, {
          $username: dbdefaults.defaultusers[user].username,
          $hash: dbdefaults.defaultusers[user].hash
        }, (err) => {
        if (err) {  
        return callback( {
            status: 'error',
            reason: 'failed to insert creds for user' + dbdefaults.defaultusers[user].username,
            message: err.message
          });
        }
      });
    }
  });
  
  // Adds the prefs table
  console.log('Adding table userprefs...');
  stmt = `CREATE TABLE userprefs (
    userid INTEGER UNIQUE PRIMARY KEY, 
    username TEXT UNIQUE NOT NULL, 
    firstname TEXT,
    lastname TEXT,
    emailaddress TEXT,
    target INTEGER,
    weeklyreport INTEGER,
    monthlyreport INTEGER,
    errorreport INTEGER,
    FOREIGN KEY(userid) REFERENCES usercred(userid) 
    )`; 

    db.run(stmt, [], (err) => {
    if (err) {  
    return callback( {
        status: 'error',
        reason: 'failed to create userprefs table',
        message: err.message
      });
    }
    // Adds the default users
    for (user in dbdefaults.defaultusers) {
      console.log('Adding default user "' + dbdefaults.defaultusers[user].username + '"');
      stmt = `INSERT INTO userprefs (userid, username, emailaddress) VALUES
        ($id, $username, $emailaddress)`;   
        db.run(stmt, {
          $id: dbdefaults.defaultusers[user].id,
          $username: dbdefaults.defaultusers[user].username,
          $emailaddress: dbdefaults.defaultusers[user].emailaddress,
        }, (err) => {
        if (err) {  
        return callback( {
            status: 'error',
            reason: 'failed to insert user' + dbdefaults.defaultusers[user].username,
            message: err.message
          });
        }
      });
    }
  });
  
  // Adds the config table
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
  
    // Inserts the default config data
    console.log('Adding default config');
    stmt = `REPLACE INTO config (id, currentuser) VALUES
      (1, $currentuser)`;   
      db.run(stmt, {
        $currentuser: dbdefaults.defaultconfig.currentuser
      }, (err) => {
      if (err) {  
      return callback( {
          status: 'error',
          reason: 'failed to insert default config',
          message: err.message
        });
      }
    });
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

    // Adds the default types
    for (type in dbdefaults.types) {
      console.log('Adding default type "' + dbdefaults.types[type] + '"');
      stmt = `INSERT INTO types (typeid, typename) VALUES
        ($id, $type)`;   
        db.run(stmt, {
          $id: parseInt(type)+1,
          $type: dbdefaults.types[type]
        }, (err) => {
        if (err) {  
        return callback( {
            status: 'error',
            reason: 'failed to insert type ' + dbdefaults.types[type],
            message: err.message
          });
        }
      });
    }
  });


  // Adds the 'categories' table
  console.log('Adding table categories...');
  stmt = `CREATE TABLE categories (
    categoryid INTEGER PRIMARY KEY, 
    categoryname TEXT NOT NULL,
    userid INTEGER,
    typeid INTEGER,
    FOREIGN KEY(userid) REFERENCES userprefs(userid)
    FOREIGN KEY(typeid) REFERENCES types(typeid)
    )`;
  db.run(stmt, [], (err) => {
    if (err) {  
    return callback( {
        status: 'error',
        reason: 'failed to create categories table',
        message: err.message
      });
    }
  
    // Adds the default categories
    for (type in dbdefaults.categories) {
      dbdefaults.categories[type].forEach( (category) => {
        console.log('Adding default category "' + category + '"');
        stmt = `INSERT INTO categories (categoryname, typeid) VALUES
          ($cat, $type)`; 
          db.run(stmt, {
            $cat: category,
            $type: dbdefaults.types.indexOf(type)+1
          }, (err) => {
          if (err) {  
          return callback( {
              status: 'error',
              reason: 'failed to insert category' + category,
              message: err.message
            });
          }
        });
      });
    }
  });

  // Adds the 'markets' table
  console.log('Adding table markets...');
  stmt = `CREATE TABLE markets (
    marketid INTEGER PRIMARY KEY,
    marketname TEXT NOT NULL,
    markettype TEXT,
    userid INTEGER,
    typeid INTEGER,
    FOREIGN KEY(userid) REFERENCES userprefs(userid)
    FOREIGN KEY(typeid) REFERENCES types(typeid)
    )`;
  db.run(stmt, [], (err) => {
    if (err) {  
    return callback( {
        status: 'error',
        reason: 'failed to create markets table',
        message: err.message
      });
    }

    // Adds the default markets
    for (type in dbdefaults.markets) {
      for (markettype in dbdefaults.markets[type]) {
        dbdefaults.markets[type][markettype].forEach( (market) => { 
          console.log('Adding default market "' + market + '"');
          stmt = `INSERT INTO markets (marketname, typeid, markettype) VALUES
            ($market, $type, $mtype)`;   
            db.run(stmt, {
              $market: market,
              $type: dbdefaults.types.indexOf(type)+1,
              $mtype: markettype
            }, (err) => {
            if (err) {  
            return callback( {
                status: 'error',
                reason: 'failed to insert market' + market,
                message: err.message
              });
            }
          });
        });
      }
    }
  });
  
  stmt = `CREATE TABLE securities (
    securityid INTEGER,
    identifier TEXT,
    typeid INTEGER,
    categoryid INTEGER,
    marketid INTEGER,
    currency TEXT,
    methods TEXT,
    annualfee REAL,
    userid INTEGER,
    FOREIGN KEY(typeid) REFERENCES types(typeid),
    FOREIGN KEY(categoryid) REFERENCES categories(categoryid),
    FOREIGN KEY(marketid) REFERENCES markets(marketid),
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
