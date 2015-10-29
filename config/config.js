var _ = require('lodash');
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

    module.exports = _.extend(
        require('./env/default'),
        require('./env/' + process.env.NODE_ENV || {})
    );