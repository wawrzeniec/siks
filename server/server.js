const express = require('express');
const https = require('https');
const fs = require('fs')
const app = express();
const scm = require('./server-config');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const ServerConfig = new scm();

const userService = require('./userservice');
const paramService = require('./paramservice');
const quoteService = require('./quoteservice');
const securityService = require('./securityservice');
const authService = require('./authservice');
const dataService = require('./dataservice');

require('typescript-require');

const ip = require('ip');
const authorizedOrigin = 'https://' + ip.address() + ':4200';
console.log(authorizedOrigin);

// Session management
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);


//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.use(session({
	store: new SQLiteStore,
	secret: 'kusoJiJiii',
	name: 'siks.id',
	proxy: true,
	cookie: { 
		maxAge: 1 * 60 * 60 * 1000,
		secure: true,
		httpOnly: false
	}, // 1 week
	resave: false,
	saveUninitialized: false,
	}));
//app.use(express.static(__dirname + '/public'));

// On startup connects to the config database
const dbname = 'siksdb.experimental.db'
//const dbname = 'siksdb.db'
const configdb = new sqlite3.Database('db/' + dbname, (err) => {
  if (err) {  
    console.log('[!!!] Error connecting to siks database: ' + err.message);
    process.exit(1);
  } else {
    console.log('Connected to [' + dbname + ']');
  }
});

// Enable CORS
// TODO: Enable only for our app not for everyone
/*app.use(cors({
    allowedOrigins: [
		'localhost:4200',
		'192.168.1.23'
	]})
);*/
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", authorizedOrigin);
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
	}
	else {
		next();
	}
});

app.use(/^(?!\/login\/?$)/, function(req, res, next) {	
	if (req.session.loggedin) {        
			console.log(req.session)	
			next()
    }
    else {
		res.status(401);
		res.json({
            status: 401,
            reason: 'Session invalid',
        });
    }
});

// Body parser for POST requests data
app.use(require('body-parser').json());

///////////////////////////////////////////////
// Authentication API
// This handles the login/sessions
///////////////////////////////////////////////
app.post('/login', (req, res) => {
	authService.login(configdb, req.body, (result) => {
		if (result.status == 200) {
			req.session.loggedin = true;
			req.session.userid = result.data;
		}
		else
		{
			req.session.loggedin = false;
		}
		res.status(result.status);
		res.json(result);		
	});
});

app.get('/login', (req, res) => {
	authService.checkSession(req.session, (result) => {		
		res.status(result.status);
		res.json(result);
	});
});

// Configuration API
// This is the endpoint to add a new user
// Here what we need to do is 
// (1) hash the password
// (2) add the new user in cred.db
// (3) create the database for this user
app.get('/users/', (req, res) => {
	userService.getUsers(configdb, req.session, req.query, (result) => {
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
// SECURITIES  
// This is the endpoints for querying and modifying app securities and their details
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

app.get('/config/securities', (req, res) => {
	paramService.getSecurities(configdb, req.query, (result) => {
		res.status(result.status);
		res.json(result);
	});
});

////////////////////////////////////
// Quotes

app.get('/quote', (req, res) => {
	quoteService.getQuote(req.query, (result) => {
		res.status(result.status);
		res.json(result);
	});
});

/////////////////////////////////////
// Securities

// Endpoint to add a security to the database
app.post('/security', (req, res) => {
	securityService.addSecurity(configdb, req.body, (result) => {
		res.status(result.status);
		res.json(result);
	});
});

app.post('/asset', (req, res) => {
	securityService.addAsset(configdb, req.session, req.body, (result) => {
		if (result.status != 200) {
			res.status(result.status);
			res.json(result);
		}
		else {
			const output = quoteService.updateNew(dbname);
			if (output.status != 0) {
				res.status(500);
				res.json({
					status: 500,
					reason: 'Failed to check for new assets',
					err: output
				})
			}
			else {
				res.status(result.status);
				res.json(result);
			}
		}				
	});
});

/////////////////////////////////////
// Accounts endpoint - to get 
// data related to accounts
app.get('/accounts', (req, res) => {
	securityService.getAccounts(configdb, req.session, (result) => {
		res.status(result.status);
		res.json(result);
	}); 
});

////////////////////////////////////
// Data enpoint - to get the data
// from the DB 
app.get('/data/summary', (req, res) => {
	dataService.getSummary(configdb, (result) => {
		res.status(result.status);
		res.json(result)
	});
});

app.get('/data/history', (req, res) => {
	dataService.getHistory(configdb, req.session, req.params.mindate, (result) => {
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

