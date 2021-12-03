/* This file serves to hold backend and helper functions used within the main server file.
   By defining the commands here and exporting them, the goal is to provide cleaner code structure
   and legibility to the main server.js file. */

var methods = {

	// Returns the ip address of the currently connected user.
	getAddress: function(req) {
		console.log("Getting ip address");
		var address = req.socket.remoteAddress;
		address.substring(address.lastIndexOf(":")+1,address.length);

		// If localhost, we edit the address so the lat/long API works.
		if(address == "0.0.0.0" || address == "127.0.0.1"){
			address = "";
		}

		return address;
	},

	// Returns the latitude and longitude given an ip address of a user.
	getLatLong: function(address,http) {
		console.log("Getting lat and long from "+address);
		http.get('http://ip-api.com/json/', (resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data = JSON.parse(chunk);
			});
			resp.on('end', () => {
				console.log("Coordinates found");
				console.log(data);
				return data;
			});
		});
		return data;
	},

	// Generates a unique random key for a user.
	generateKey: function() {
		let keyCode = '';
		let randomize = 0;
		for (let i = 0; i < 255; i++){
			randomize = Math.floor(Math.random() * 3);
			if (randomize === 0){
				keyCode += String.fromCharCode(97 + Math.floor(Math.random() * 26));
			}
			if (randomize === 1){
				keyCode += String.fromCharCode(65 + Math.floor(Math.random() * 26));
			}
			if (randomize === 2){
				keyCode += String.fromCharCode(48 + Math.floor(Math.random() * 10));
			}
		}
		return keyCode;
	},

	// Database functions
	// =========================================
	createDbConnection: function(mysql) {
		var newConnection = mysql.createConnection({
			host: process.env.MYSQLDB_DATABASE,
			user: process.env.MYSQLDB_USER,
			password: process.env.MYSQLDB_ROOT_PASSWORD,
			database: process.env.MYSQLDB_DATABASE,
			port: 3306
		});
		return newConnection;
	},

	createTable: function(connection) {
		//console.log('Connected to <' + process.env.DB_NAME + '> as id ' + connection.threadId);
		var createPrivTable = "CREATE TABLE IF NOT EXISTS privacy (key_id varchar(500), lat decimal(6,4), lon decimal(7,4))";
		connection.query(createPrivTable, function(err, results, fields) {
			if (err) { 
				console.log("Table creation has failed.");
			}
			else{
				console.log("Privacy table successfully created.");
			}
		});
	},

	// Web-Socket functions
	// =========================================

	requestDataUpdate: function(ws,connection,request,http,webSocket) {
		success = false
		ws.on('connection', function (ws, req) {
			if(success){
				//ws.close();
				// Do nothing.
			}
			else{
				ws.send("message:update-request");
				ws.on('message', function (data) {
					ws.send("message:I received your message!");
					var receivedData = JSON.parse(data);
					console.log("RECEIVED:");
					console.log(receivedData);

					// Write the data or update it if it exists.
					// (Note the update is only if there are multiple web-socket messages stuck in the network send pipe.
					// During development, if cookies were deleted to simulate a new user connecting, there would be a flood
					// of duplicate update-request messages. They may be due to the web-socket thinking the delivery failed
					// and performing re-sends. If this is the case, we can safely suppress this isue using INSERT IGNORE).
					var selectQuery = "SELECT * FROM privacy WHERE key_id = '"+receivedData.key+"';";
					connection.query(selectQuery, function(err, result) {
						if (err) {
							console.log("Could not check key_id");
						}
						else{
							console.log(result.length);

							if (result.length === 0){
								console.log("New key");

								// Get the address.
								var address = request.socket.remoteAddress;
								address.substring(address.lastIndexOf(":")+1,address.length);

								// If localhost, we edit the address so the lat/long API works.
								if(address == "0.0.0.0" || address == "127.0.0.1"){
									address = "";
								}

								// Get the coordinates.
								http.get('http://ip-api.com/json/', (resp) => {
									let coords = '';
									resp.on('data', (chunk) => {
										coords = JSON.parse(chunk);
									});
									resp.on('end', () => {
										console.log("Coordinates found");
										console.log(coords);
										// Send the coords so the client can render the map.
										ws.send("lat:"+coords.lat+" lng:"+coords.lon);

										var insertQuery = "INSERT IGNORE INTO privacy (key_id, lat, lon) VALUES ('"+receivedData.key+"', " +coords.lat + ", " +coords.lon +")";
											connection.query(insertQuery, function(err, result) {
												if (err) {
													console.log("Could not update!");
												}
												else{
													//TODO suppress this as it might output multiple times, due to above note.
													console.log("Added "+receivedData.key+" to the database.");
												}
											});
										});
								});
							} else {
								console.log("Old Key");
							}
						}
					});
					

					success = true;
					//ws.close();
				});
			}
		});
	},

	sendData: function(ws,data) {
		ws.on('connection', function (wss, req) {
			wss.send(data);
			console.log("SENT TO CLIENT:");
			console.log(data);
		});
	}
};

module.exports = methods;
