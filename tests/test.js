var request = require('supertest');
var app = require('../app').app;

describe('Connect to the website', function(){
	it("request json site content", function(done){
		request(app)
			.get("/sitecontent")
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, {result : 4.6})
			.end(function (err) {
				if(err){
					return done(err);
				}
				return done();
			})
	});
