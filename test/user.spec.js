// Dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../app/server.js');

// Data
const userMock = require('../app/models/get-user.js');

// Core
const server = new Server();
const app = server.app;
const should = chai.should();

chai.use(chaiHttp);

/**
 * GET /user
 */
describe('GET /user', () => {
  it('GET /show:id should not get an user by false id', (done) => {
    chai.request(app)
      .get('/user/show/12')
      .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql('{}');

          done();
      });
  });

  it('GET /show:id should have not id in url', (done) => {
    chai.request(app)
      .get('/user/show/')
      .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eql('{"code":404,"message":"Not Found"}');

          done();
      });
  });

  it('GET /show:id should get an user result with id 1', (done) => {
    chai.request(app)
      .get('/user/show/1')
      .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql('{"name":"cyril","age":30,"gender":"male"}');

          done();
      });
  });

  it('POST /create should create an user', (done) => {
    const result = '{"1":{"name":"cyril","age":30,"gender":"male"},"2":{"name":"jp","age":24,"gender":"male"},"3":{"name":"guillaume","age":2,"gender":"male"},"4":{"name":"tutu","age":45,"gender":"male"}}';
    const payload = {'name': 'tutu','age': 45,'gender': 'male'};

    chai.request(app)
      .post('/user/create')
      .send(payload)
      .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql(result);

          done();
      });
  });

  it('POST /create should check the payload body is false', (done) => {
    const result = '{"errors":[{"parameter":"nme","value":"tutu","message":"Unexpected value."},{"parameter":"ag","value":40,"message":"Unexpected value."},{"parameter":"gende","value":"male","message":"Unexpected value."},{"parameter":"name","message":"Required value."}]}';
    const payload = {'nme': 'tutu','ag': 40,'gende': 'male'};

    chai.request(app)
      .post('/user/create')
      .send(payload)
      .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.eql(result);

          done();
      });
  });
});