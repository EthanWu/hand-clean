var express = require('express'),
//system dependency.

//local config file.
    config = require('./config/config');

//middleware
var app = express();

//Load config file.
require('./config/log')(app);

//Load router file.


app.get('/', function (req, res) {
    res.send('hello world');
});

app.get('/ethan', function (req, res) {
    res.send('My name is Ethan.');
});

app.listen(config.port);
console.log('The server is listening on port ', config.port);