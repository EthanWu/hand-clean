var request = require('supertest'),
    assert = require('assert'),
    app = require('../server'),
    agent = request(app);
describe('version test', function () {
    it('get version number', function (done) {
        agent.get('/version')
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.text,'The version of the server is 1.0.0','version number doesnot match.');
                done();
            });
    });
});