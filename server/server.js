const express = require('express');
const https = require('https');
const fs = require('fs')
const app = express();
const scm = require('./server-config');
const sqlite3 = require('sqlite3');
const ServerConfig = new scm();

const userService = require('./userservice');
const paramService = require('./paramservice');
const quoteService = require('./quoteservice');
const securityService = require('./securityservice');

// On startup connects to the config database
const configdb = new sqlite3.Database('db/siksdb.db', (err) => {
  if (err) {  
    console.log('[!!!] Error connecting to siks database: ' + err.message);
    process.exit(1);
  } else {
    console.log('Connected to siks database');
  }
});

// Enable CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

// Body parser for POST requests data
app.use(require('body-parser').json());

// Configuration API
// This is the endpoint to add a new user
// Here what we need to do is 
// (1) hash the password
// (2) add the new user in cred.db
// (3) create the database for this user
app.get('/users/', (req, res) => {
	userService.getUsers(configdb, req.query, (result) => {
		res.status(result.status);
		res.json(result);
	});
});

app.head('/users/:username', (req,res) => {
	userService.checkUserExists(configdb, req.params.username, (result) => {
		res.status(result.status);
		res.json(result);
	});
});

app.get('/users/:username', (req,res) => {
	userService.getUserDetails(configdb, req.params.username, (result) => {
		res.status(result.status);
		res.json(result);
	});
});

app.post('/users/', (req, res) => {
	// Queries user name in the database
	userService.checkUserExists(configdb, req.body.userName, (result) => {
		if (result.status == 200) {
			// User not found, add it to the DB
			userService.createUser(
				configdb, 
				req.body.userName,
				req.body.emailAddress,
				req.body.password,
				(result) => {
					res.status(result.status);
					res.json(result);
				});
		}
		else {
			res.status(result.status);
			res.json(result);
		}
	});
});


///////////////////////////////
// CONFIG & PARAMETERS 
// This is the endpoints for querying and modifying app configuration parameters
app.get('/config/types', (req, res) => {
	paramService.getTypes(configdb, req.query, (result) => {
		res.status(result.status);
		res.json(result);
	});
});

app.get('/config/categories', (req, res) => {
	paramService.getCategories(configdb, req.query, (result) => {
		res.status(result.status);
		res.json(result);
	});
});

app.get('/config/markets', (req, res) => {
	paramService.getMarkets(configdb, req.query, (result) => {
		res.status(result.status);
		res.json(result);
	});
});


////////////////////////////////////
// Quotes

app.get('/quote', (req, res) => {
	quoteService.getQuote(req.query, (result) => {
		res.status(result.status);
		res.json(result)
	});
});

/////////////////////////////////////
// Securities

app.post('/security', (req, res) => {
	securityService.addSecurity(configdb, req.body, (result) => {
		res.status(result.status);
		res.json(result)
	});
});


////////////////////////////////////
// Default enpoint - to check server
app.get('/', (req, res) => {
	res.send('Server working!');
        console.log(configdb);
});


// Starts the server in HTTPS or HTTP
if (ServerConfig.https)
{
	https.createServer({
		key: fs.readFileSync('siks-server.key'),
		cert: fs.readFileSync('siks-server.cert')
	  }, app)
	  .listen(ServerConfig.port, function () {
		console.log('HTTPS running on port ' + ServerConfig.port + '.');
	  })
}
else {
	app.listen(ServerConfig.port, () => {
		console.log('HTTP server started on port ' + ServerConfig.port + '.');
	});
}

