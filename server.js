/*
	InternetPrivacy Server.

	This node server serves as a backend API service to the front-end files found within the 'public' folder.
	The following APIs are used in this website:
		api.ipstack.com: Service used to obtain latitude, longtitude and city from a user.
		google maps API: Renders a google maps view when taking in the above latitude and longitude as input.
*/
var express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');
'use strict';
const mysql = require('mysql');
const fs = require('fs');
var WebSocketServer = require('ws').Server;
var http = require('http')
var httpSocket= (http).createServer();
var bodyParser = require('body-parser');
const app = express();
const PORT = process.env.NODE_DOCKER_PORT || 80;
let personnelData = {
	  key: "",
      lat: null,
      long: null,
}
const connection = mysql.createConnection({
	host: process.env.MYSQLDB_DATABASE,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
	port: 3306
});
connection.connect(function(err) {
	if (err) {
	  console.error('error connecting: ' + err.stack);
	  return;
	}
	console.log('Connected to <' + process.env.DB_NAME + '> as id ' + connection.threadId);
	var createPrivTable = "CREATE TABLE IF NOT EXISTS privacy (key_id varchar(500), lat decimal(6,4), lon decimal(7,4))";
	connection.query(createPrivTable, function(err, results, fields) {
		if (err) { 
			console.log("Create table fail");
		}
		console.log(results);
		console.log("yo");
	});

	var selPrivTable = "SELECT * FROM privacy";
	connection.query(selPrivTable, function(err, results, fields) {
		if (err) {
			console.log("Can not select from privacy");
		  	console.log(fields);
		}
		console.log(results);
		console.log("lat = %d\n", results[0].lat);
	});

});
// Grab the API key for ipstack.com in order to get latitude and longitude data from the user.
var accessKey = process.env.IPSTACK_API;

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));

app.use(express.urlencoded({ extended: true }));
const pageContentFile = fs.readFileSync("./public/content.json");

// Start the application server.
app.listen(PORT, () => {
	console.log("Application server is running");
});


// Random Key Generator.
function randomKey(){
	let keyCode = '';
	for (let i = 0; i < 64; i++){
		keyCode += String.fromCharCode(97 + Math.floor(Math.random() * 26));
	}
	return keyCode;
}

app.get('/', (req, res) => {
	res.sendFile('/public/index.html', {root: __dirname});
});

/*  This is called when a user first visits the site. Uses ipstack.com to find the latitude, longtitude and city.
	Creates a cookie and sends it back to the user. The latitude and longitude are then passed into the Google Maps API.
	A check is performed on the client to only request locationcontent if the cookie does not exist.
	This reduces the amount of calls on the ipstack.com API, and also demonstrates how cookies can be used to identify
	if a user has visited the site before.
*/
app.get('/key', (req, res) => {
	console.log("getting new key")
	var cookie = req.cookies.key;
	if(cookie === undefined){
		// No key present, so query the ip and grab the latitude and longitude used for the map. 
		let key = randomKey();

		//TODO query database if the key exists, and if so, send all of the information needed to the user.


		// Else, key does not exist in database.
		// Use the ip address and call ipstack to get latitude and longitude to store in database.
		var address = req.socket.remoteAddress;
		address = address.substring(address.lastIndexOf(":")+1,address.length);

		// Check the address to make sure it is not localhost.
		// If the address is empty, the ip-api site automatically uses the ip address from the requesting computer.
		// Which would be this server. Useful when in development.
		if(address == "0.0.0.0" || address == "127.0.0.1"){
			address = "";
		}
		http.get('http://ip-api.com/json/', (resp) => {
			let data = '';
			
			resp.on('data', (chunk) => {
				data = JSON.parse(chunk);
				res.cookie('key', key);

				// Temporarily setting the latitude and longitude for the map to work as cookies.
				//TODO remove these lat/lon cookies 
				res.cookie('lat',data.lat);
				res.cookie('lon',data.lon);
			});
			
			resp.on('end', () => {
				console.log("Key saved");
				console.log("New key insert");
				console.log(key);
				connection.query("INSERT INTO privacy SET ?",
				{
					key_id: key,
					lat: data.lat,
					lon: data.lon
				},
				function(err, res) {
					if (err) throw err;
						console.log("Insert fail");
						console.log(res);
					});
				console.log(data);
				res.send('Success');
			});
		});
	}
});

//TODO refactor the sitecontent, we should make several queries here where we can get data from the database
// without opening it up to sql injections.
// Example queries could be '/location' which would return lat/lon values, '/device' to return all device info, etc.
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

//let connection = require("./dbconfig");

/*  Start the server. Because port 80 is reserved, sudo is required to start the server.
	User must also ensure that networking is properly port-forwarding port 80 to the server's ip address.
	(Note: Upgrading to https will require switching the port to 443, but will also force the user to receive
	a popup screen stating that self-signed certificates are unsafe. To avoid this, http has been preferred.
*/

app.post("/data", (req, resp) => {
	resp.json([{
		long: req.body.long,
		key: req.body.key,
		lat: req.body.lat
	}])
	personnelData.key = '' + req.body.key;
	personnelData.long = req.body.long;
	personnelData.lat = req.body.lat;
	console.log(personnelData);
 })

// Start the Web-Socket server.
var ws = new WebSocketServer({server:httpSocket});

ws.on('connection', function (ws, req) {
	console.log("Connection: "+req.connection.remoteAddress);

	ws.on('message', function (data) {
		console.log("Received: *"+data+"*");
		ws.send("message:I received your message!");
	});
});


httpSocket.listen(8005, function () {
	console.log("Websocket server is running");
});
