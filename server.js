/*
	InternetPrivacy Server.

	This node server serves as a backend API service to the front-end files found within the 'public' folder.
	The following APIs are used in this website:
		api.ipstack.com: Service used to obtain latitude, longtitude and city from a user.
		google maps API: Renders a google maps view when taking in the above latitude and longitude as input.
*/
var express = require('express');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const fs = require('fs');
var app = express();

// Grab the API key for ipstack.com in order to get latitude and longitude data from the user.
var accessKey = process.env.IPSTACK_API;

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const pageContentFile = fs.readFileSync("./public/content.json");

app.get('/', (req, res) => {
	res.sendFile('/public/index.html', {root: __dirname});
});

/*  This is called when a user first visits the site. Uses ipstack.com to find the latitude, longtitude and city.
	Creates a cookie and sends it back to the user. The latitude and longitude are then passed into the Google Maps API.
	A check is performed on the client to only request locationcontent if the cookie does not exist.
	This reduces the amount of calls on the ipstack.com API, and also demonstrates how cookies can be used to identify
	if a user has visited the site before.
*/
app.get('/locationcontent', (req, res) => {
	var cookie = req.cookies.city;
	var cookieContent = '';
	if(cookie === undefined){
		// Grab the location of the connected ip and save it to the cookie.
		var address = req.socket.remoteAddress;
		address = address.substring(address.lastIndexOf(":")+1,address.length);
		http.get('http://api.ipstack.com/'+address+"/?access_key="+accessKey, (resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data = JSON.parse(chunk);
				//cookieContent += data.latitude+","+data.longittude+","+data.city;
				res.cookie('latitude', data.latitude);
				res.cookie('longitude', data.longitude);
				res.cookie('city', data.city);
			});
			resp.on('end', () => {
				console.log(data);
				console.log("sending location data in cookie.");
				res.send("Succcess");
			});
		});
	}
});

/*  Sends the content.json file to the site. This is used to access the actual content of the website,
	and dynamically generate/fill different sections of the website as the user navigates to them.
*/
app.get('/sitecontent', (req, res) => {
	var address = req.socket.remoteAddress;
	address = address.substring(address.lastIndexOf(":")+1,address.length);
	var cookie = req.cookies.city;
	if(cookie === undefined){
		console.log("New connection to the site: "+address);
	}
	else{
		console.log("Refreshed connection from: "+address);
	}
	res.sendFile('/public/content.json', {root: __dirname});
});

/*  Start the server. Because port 80 is reserved, sudo is required to start the server.
	User must also ensure that networking is properly port-forwarding port 80 to the server's ip address.
	(Note: Upgrading to https will require switching the port to 443, but will also force the user to receive
	a popup screen stating that self-signed certificates are unsafe. To avoid this, http has been preferred.
*/
var server = app.listen(80, () => {
	console.log("Server is running on port 80.");
});
