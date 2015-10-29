var express = require('express'),
//system dependency.

//local config file.
    config = require('./config/env/default');

//middleware
var app = express();

require('./config/log')(app);


app.get('/', function (req, res) {
    res.send('hello world');
});

app.get('/ethan', function (req, res) {
    res.send('My name is Ethan.');
});

app.listen(config.port);
console.log('The server is listening on port ', config.port);