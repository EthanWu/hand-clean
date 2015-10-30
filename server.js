var express = require('express'),
//system dependency.
    mongoose = require('mongoose'),
//local config file.
    config = require('./config/config');

//middleware
var app = express();

//Load config file.
require('./config/log')(app);

//connect to mongodb and load data model.
require('./models');
//Load router file.
require('./router')(app);

app.listen(config.port);
console.log('The server is listening on port ', config.port);