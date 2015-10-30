var mongoose = require('mongoose'),
    glob = require('glob'),
    path = require('path'),

//local config file.
    config = require('../config/config');

mongoose.connect(config.mongo_url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
files = glob.sync('**/*.model.js').forEach(function (file) {
    require(path.resolve(file));
});