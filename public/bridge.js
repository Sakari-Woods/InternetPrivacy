console.log("Bridge loaded.");
var ws = new WebSocket("ws://sakaribox.ddns.net:8005");

ws.onopen = function(event) {
	console.log("Socket connection has been opened.");
};

ws.onmessage = function(event) {
	console.log("Received data from the server: "+event.data);
};

ws.onclose = function(event) {
	console.log("Socket connection has been closed.");
};

ws.onerror = function(error) {
	console.log("Socket error: "+error.message);
};

// Test functionality.
function sendMsg(message){
	console.log("client is sending message: *"+message+"*");

	// Here We're adding "message:" as a flag to our data so we know what to do with it.
	ws.send("message:"+message);
}
