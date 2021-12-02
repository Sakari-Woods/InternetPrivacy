var ws = new WebSocket("ws://localhost:8005");

ws.onopen = function(event) {
	// Socket connection has been opened.
};

ws.onmessage = function(event) {
	console.log("Received data from the server: *"+event.data+"*");
	if(event.data.toString() == "message:update-request"){

		// Send the collected data as an update.
		var dataSend = {
			"key": document.cookie.substring(document.cookie.indexOf("=")+1),
			"data": "blah blah blah"
		};

		ws.send(JSON.stringify(dataSend));
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
