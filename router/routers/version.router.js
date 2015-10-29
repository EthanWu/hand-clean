module.exports = function(app){
    app.route('/version').get(function(req,res){
        res.send('The version of the server is 1.0.0');
    })

};