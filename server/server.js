const express = require('express');
const https = require('https');
const fs = require('fs')
const app = express();
const scm = require('./server-config');
const sqlite3 = require('sqlite3');
const ServerConfig = new scm();

// On startup connects to the config database
const configdb = new sqlite3.Database('db/siksconfig.db', (err) => {
  if (err) {  
    console.log('[!!!] Error connecting to config database: ' + err.message);
    process.exit(1);
  } else {
    console.log('Connected to config database');
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
app.post('/users/', (req, res) => {
	let message = 'Adding user ' + req.body.userName + 
	' with email ' + req.body.emailAddress + 
	' and password ' + req.body.password + '\n';
	res.status(404);
	console.log(message);
	let response = {status: 'error', 'reason': 'Function not implemented'}
	res.json(response);
});

app.get('/', (req, res) => {
	res.send('Server working!');
        console.log(configdb);
});

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

