// Request/generate the key for the user.
if(document.cookie.length < 1){
	console.log("Requesting new key");
	let keyrequest = new XMLHttpRequest();
	keyrequest.open('GET', '/key');
	keyrequest.responseType = 'json';
	keyrequest.send();
	keyrequest.onload = function(){
		const keyData = locrequest.response;
		setInterval(initMap(),200);
	}
}

//TODO refactor this to request a json frame for information gathered.
// Receive the content for the website via JSON file.
let request = new XMLHttpRequest();
request.open('GET', '/sitecontent');
request.responseType = 'json';
request.send();
var pageContent;
request.onload = function(){
	const jsonText = request.response;
	pageContent = jsonText;

	// Activate zooming map.
	zoomSys = setInterval(zoomFunc, 200);
}

function zoomFunc() {
	try{
	if(map.getZoom() < 13){
			map.setZoom(map.getZoom()+1);
	}
	else{
		clearInterval(zoomSys);
	}
	}
	catch{}
}


// Manage the map function.
var map;
function initMap() {
	setTimeout(function(){	
		var coords = document.cookie.split(" ");
		var latVal = coords[1].substring(coords[1].lastIndexOf('=')+1,coords[1].length); 
		var lngVal = coords[2].substring(coords[2].lastIndexOf('=')+1,coords[2].length); 
		map = new google.maps.Map(document.getElementById('map'), {
		mapId: "6476ad7bfe7aa057",
		center: {lat: parseFloat(latVal), lng: parseFloat(lngVal)},	
		disableDefaultUI: true,
		zoomControl: false,
		zoom: 2});
	},1000);

}
