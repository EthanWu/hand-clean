module.exports = function(app){
    app.route('/ethan').get(function(req,res){
        res.send('Ethan is comming');
    })
};