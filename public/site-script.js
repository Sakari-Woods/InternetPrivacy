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
//below this comment is the JQuery to handle API requests
$(document).ready(function() {
    var wData = {
      cityName: "",
      lat: null,
      long: null,
      conditions: "",
      wind: "",
      temp: "",
      humid: "",
      uvI: "",
      
    }
	var current = weather();
	var censi = census();
    
    function weather(){
		var coords = document.cookie.split(" ");
		var lat = coords[1].substring(coords[1].lastIndexOf('=')+1,coords[1].length-1); 
		var long = coords[2].substring(coords[2].lastIndexOf('=')+1,coords[2].length);
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly" + "&appid=209f024f18b94911ca5d243388fea797";
    
    $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) { 
			console.log(response);
			var time = moment().format('llll');
			$("#currCity").text(response.name+ "  ");
			$("#currCity").append(time);
			wData.lat = lat;
			wData.long = long;
			$("#icon").empty(iconSelector(response.weather[0].icon));       
			$("#icon").append(iconSelector(response.weather[0].icon));       
			$("#cWind").text("wind Speed: " + response.wind.speed +" mph");
			$("#cTemp").text("Temperature: " + ((response.main.temp -273.15)/5*9 + 32).toFixed(1) +" F");
			$("#cHum").text("Humidity: " + response.main.humidity +"%");
		});
    
    }
  	function iconSelector(icon){
    	var iconImg = $("<img>");
    	var iconUrl = "https://openweathermap.org/img/wn/";   
    	iconImg.attr("src", iconUrl + icon + "@2x.png");
    	return iconImg;
	}
	function census(){
		var coords = document.cookie.split(" ");
		var lat = coords[1].substring(coords[1].lastIndexOf('=')+1,coords[1].length-1); 
		var long = coords[2].substring(coords[2].lastIndexOf('=')+1,coords[2].length);
		queryURL = "https://api.geocod.io/v1.6/reverse?q="+lat+","+long+"&fields=acs-demographics,acs-economics,acs-families,acs-housing,acs-social&api_key=33f164f47278768378338225572873f34154186"
		$.ajax({
			url: queryURL,
			method: "GET"
        }).then(function(responds) {
			console.log(responds);
		})
	}

})

