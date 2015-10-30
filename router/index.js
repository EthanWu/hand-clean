var glob = require('glob'),
    path = require('path');
module.exports = function(app){
    files = glob.sync('**/*.router.js').forEach(function(file){
        require(path.resolve(file))(app);
    });
};
