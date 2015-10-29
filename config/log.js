var logger = require('morgan'),
    fs = require('fs');
function configLog(app) {

    if (process.env.NODE_ENV === 'development') {
        app.use(logger('dev'));
    }

    if (process.env.NODE_ENV === 'production') {
        //如果是生产环境，则使用文件记录日志
        var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
        app.use(logger('dev', {stream: accessLogStream}));
    }
}
module.exports = configLog;