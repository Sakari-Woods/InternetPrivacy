/* This file serves to hold backend and helper functions used within the main server file.
   By defining the commands here and exporting them, the goal is to provide cleaner code structure
   and legibility to the main server.js file. */

var methods = {

	// Returns the ip address of the currently connected user.
	getAddress: function() {
		console.log("Getting ip address");
	},

	// Returns the latitude and longitude given an ip address of a user.
	getLatLong: function(address) {
		console.log("Getting lat and long from "+address);
		return "coords";
	},

	// Generates a unique random key for a user.
	generateKey: function() {
		let keyCode = '';
		for (let i = 0; i < 64; i++){
			keyCode += String.fromCharCode(97 + Math.floor(Math.random() * 26));
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

	requestDataUpdate: function(ws,connection) {
		success = false
		ws.on('connection', function (ws, req) {
			if(success)
				ws.close();
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
					var insertQuery = "INSERT IGNORE INTO privacy (key_id, lat, lon) VALUES ('"+receivedData.key+"', 12, 13)";
					connection.query(insertQuery, function(err, result) {
						if (err) {
							console.log("Could not update!");
						}
						else{
							//TODO suppress this as it might output multiple times, due to above note.
							console.log("Added "+receivedData.key+" to the database.");
						}
					});

					success = true;
					ws.close();
				});
			}
		});
	},

	sendData: function(ws,data) {
		ws.on('connection', function (ws, req) {
				if(ws){
					ws.send("data:"+data);
				}
				else{
					console.log("sendData() ws failure.");
				}
		});
	}
};

module.exports = methods;
