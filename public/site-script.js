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
$(window).on("load",function() {
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
			// var time = moment().format('llll');
			// $("#currCity").text(response.name+ "  ");
			// $("#currCity").append(time);
			// wData.lat = lat;
			// wData.long = long;
			$("#icon").empty(iconSelector(response.current.weather[0].icon));       
			$("#icon").append(iconSelector(response.current.weather[0].icon));
			console.log(response.current.weather[0].icon);    
			if (response.current.weather[0].main === "Rain"){
				$("#sell").text("Buy an umbrella to stay dry.")
			} 	else if (response.current.weather[0].main === "Clouds"){
				$("#sell").text("Buy a hoody to stay warm.")
			} 	else if (response.current.weather[0].main === "Mist"){
				$("#sell").text("Come in for a hot coffee or cocoa on a dreary day like this.")
			}	else if (response.current.weather[0].main === "Clear"){
				$("#sell").text("A nice pair of shades would compliment this weather.")
			}	else if (response.current.weather[0].main === "Thunderstorm"){
				$("#sell").text("Buy these electric proof golf clubs and golf in any weather.")
			}	else if (response.current.weather[0].main === "Drizzle"){
				$("#sell").text("A raincoat would be perfect today, and we have them all styles.")
			}	else if (response.current.weather[0].main === "Snow"){
				$("#sell").text("Tire chains are just what you need right now, get them at 150% normal price.")
			}
			// $("#Wind").text("wind Speed: " + response.current.wind_speed +" mph");
			// console.log("wind Speed: " + response.current.wind_speed +" mph");
			// $("#Temp").text("Temperature: " + ((response.current.temp -273.15)/5*9 + 32).toFixed(1) +" F");
			// $("#Hum").text("Humidity: " + response.current.humidity +"%");
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
			$("#fmedian").text(responds.results[0].fields.acs.demographics.Sex.Female.percentage * 100 + "% of population female");
			$("#mmedian").text(responds.results[0].fields.acs.demographics.Sex.Male.percentage * 100  + "% of population male");
			$("#amedian").text(responds.results[0].fields.acs.demographics['Median age'].Total.value + " years is the average age");
			$("#economics").text(responds.results[0].fields.acs.economics['Median household income'].Total.value + " dollars annually is the average household income")
			$("#latino").text((responds.results[0].fields.acs.demographics['Race and ethnicity']['Hispanic or Latino'].percentage * 100).toFixed(1) + "% chance you identify as Hispanic or Latino");
			$("#white").text((responds.results[0].fields.acs.demographics['Race and ethnicity']['Not Hispanic or Latino: White alone'].percentage * 100).toFixed(1) + "% chance you identify as Caucasian");
			$("#black").text((responds.results[0].fields.acs.demographics['Race and ethnicity']['Not Hispanic or Latino: Black or African American alone'].percentage * 100).toFixed(1) + "% chance you identify as Black or African American");
			$("#asian").text((responds.results[0].fields.acs.demographics['Race and ethnicity']['Not Hispanic or Latino: Asian alone'].percentage * 100).toFixed(1) + "% chance you identify as Asian");
			$("#female").text("As a woman you are ")
			$("#female").append(Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Divorced'].percentage * 100) + "% likely to be divorced, ")
			$("#female").append(Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Now married'].percentage * 100) + "% likely to be married, ")
			$("#female").append(Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Never married'].percentage * 100) + "% likely to have not been married and ")
			$("#female").append(Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Widowed'].percentage * 100) + "% likely to be widowed")
		})
	}

})
