var express = require('express')
  , bodyParser = require('body-parser')
  , should = require('should')
  , request = require('supertest')
  , validator = require('validator')
  , check = require('..')
  , rule = check.rule
  ;

describe('rule', function() {
  it('should create instance of Rule', function() {
    check.rule('someKey').should.instanceOf(check.Rule);
  });
  it('should contain all validator methods', function() {
    for (var name in validator) {
      if (validator.hasOwnProperty(name) &&
          typeof validator[name] === 'function') {
        should.exist(check.Rule.prototype[name]);
      }
    }
  });
});

describe('validator', function() {
  var app;

  beforeEach(function() {
    app = express();
    app.use(bodyParser());
  });

  it('should return 400 bad request if input invalid', function(done) {
    app.use(check('query', rule('username').notEmpty()));
    request(app)
      .get('/')
      .query({username: ''})
      .expect(400, function(err) {
        should.not.exist(err);
        done();
      });
  });
  it('should support different data source', function(done) {
    app.use(check('body', rule('username').notEmpty()));
    request(app)
      .post('/')
      .send({username: ''})
      .expect(400, function(err) {
        should.not.exist(err);
        done();
      });
  });
});
