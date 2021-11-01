// Request the location of the user, if it isn't already stored via cookies.
if(document.cookie.length < 1){
	let locrequest = new XMLHttpRequest();
	locrequest.open('GET', 'http://sakaribox.ddns.net/locationcontent');
	locrequest.responseType = 'json';
	locrequest.send();

	locrequest.onload = function(){
		const locText = locrequest.response;
		initMap();
	}
}

// Receive the content for the website via JSON file.
// This sets the pageContent variable for later use.
let request = new XMLHttpRequest();
request.open('GET', 'http://sakaribox.ddns.net/sitecontent');
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
	catch{
		// Do nothing here.
		// This gets triggered when the site tries to zoom into the map before the map has finished loading.
	}

}


// Manage the map function.
var map;
function initMap() {
	setTimeout(function(){	
		var coords = document.cookie.split(';');
		var latVal = coords[0].substring(coords[0].lastIndexOf('=')+1,coords[0].length); 
		var lngVal = coords[1].substring(coords[1].lastIndexOf('=')+1,coords[1].length); 
		map = new google.maps.Map(document.getElementById('map'), {
		mapId: "6476ad7bfe7aa057",
		center: {lat: parseFloat(latVal), lng: parseFloat(lngVal)},	
		disableDefaultUI: true,
		zoomControl: false,
		zoom: 2});
	},1000);
}
