/*
	InternetPrivacy Server.

	This node server serves as a backend API service to the front-end files found within the 'public' folder.
	The following APIs are used in this website:
		api.ipstack.com: Service used to obtain latitude, longtitude and city from a user.
		google maps API: Renders a google maps view when taking in the above latitude and longitude as input.
*/

// Define our variables and required libraries.
require('dotenv').config();
var express = require('express');
var WebSocketServer = require('ws').Server;
var http = require('http')
var httpSocket= (http).createServer();
var bodyParser = require('body-parser');
var accessKey = process.env.IPSTACK_API;
var backend = require('./backend.js');
const cookieParser = require('cookie-parser');
const path = require('path');
'use strict';
const mysql = require('mysql');
const fs = require('fs');
const app = express();
const PORT = process.env.NODE_DOCKER_PORT || 80;

// Create the data structure used to pass information back and forth to the user.
let personnelData = {
	  key: "",
      lat: null,
      long: null,
}

// Define the connection details for the backend database.
const connection = backend.createDbConnection(mysql);

// Start the Web-Socket server.
var ws = new WebSocketServer({server:httpSocket});

// Create the database connection on start, creating the table if this is the first time.
connection.connect(function(err) {
	if (err) {
	  console.error('error connecting: ' + err.stack);
	  return;
	}

	// Create the table if neccessary.
	backend.createTable(connection);
});

// Configure the application for express and parsing.
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));

// Start the application server.
app.listen(PORT, () => {console.log("Application server is running");});

// On successful connection to port 80, send the index.html file to the user.
app.get('/', (req, res) => {
	res.sendFile('/public/index.html', {root: __dirname});
});

// Create a new database entry if there is a new user, otherwise query previous information and send it to the client.
app.get('/key', async (req, res) => {
	var cookie = req.cookies.key;

	// New user.
	if(cookie === undefined){
		console.log("New user connected.");
		// Create a new key to identify the user.
		let key = backend.generateKey();
		res.cookie('key', key);

		// Send the generated cookie so it's associated once we receive the callback for the requested data.
		res.send('Success');

		// Request an update of information from the client, and write to the database.
		await backend.requestDataUpdate(ws,connection);
	}

	// Existing user.
	else{
		// TODO
		console.log("Existing user "+cookie+" connected.");
		// Send the stored data back to the client.
		backend.sendData(ws,data);
		res.send('Success');
	}
});

// Start listening on the Websocket server.
httpSocket.listen(8005, function () {
	console.log("Websocket server is running");
});
