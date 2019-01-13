const express = require('express');
const app = express();

// Configuration API
// This is the endpoint to add a new user
app.get('/config/adduser/:username&:password', (req, res) => {
// Here what we need to do is 
// (1) hash the password
// (2) add the new user in cred.db
// (3) create the database for this user
	res.send('Adding user ' + req.params.username + 
	' with password ' + req.params.password + '\n');
});


app.get('/', (req, res) => {
	res.send('Server working!');
});

app.listen(8000, () => {
	console.log('Server started on port 8000');
});
