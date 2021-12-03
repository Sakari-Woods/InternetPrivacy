var ws = new WebSocket("ws://localhost:8005"); // sakaribox.ddns.net

// Create the userData object.
let userData = {
	lat: '',
	lon: ''
};

ws.onopen = function(event) {
	// Socket connection has been opened.
};

ws.onmessage = function(event) {
	console.log("Received from server: *"+event.data+"*");
	if(event.data.toString() == "message:update-request"){

		// Send the collected data as an update.
		var dataSend = {
			"key": document.cookie.substring(document.cookie.indexOf("=")+1),
			"data": "more data can be sent here",
			"lat": 12.0000,
			"lon": 13.0000
		};
		ws.send(JSON.stringify(dataSend));
	}
	else{
		var received = event.data;
		// Handle the information if they are coordinates.
		if(received && received.substring(0,3) == "lat"){
			var receivedCoords = received.split(" ");
			userData.lat = receivedCoords[0].split(":")[1];
			userData.lon = receivedCoords[1].split(":")[1];
		}
	}
};

ws.onclose = function(event) {
	console.log("Socket connection has been closed.");
};

ws.onerror = function(error) {
	console.log("Socket error: "+error.message);
};

// Test functionality.
function sendMsg(message){
	console.log("client is sending *"+message+"*");
	ws.send(message);
}
