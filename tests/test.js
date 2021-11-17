var request = require('supertest');
var app = require('/app').app;

request = request('http://localhost:80');

request.get('/').expect(200, function(err){
	console.log(err);
});
