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
	// JSON content has been loaded.

	// Page effects.
	// Initial delay with typing out of location question.
	var i = 0;
	function typeQuestion() {
		if (i < pageContent.data.privacyquestion.length) {
			document.getElementById("privacymodal").innerHTML += pageContent.data.privacyquestion.charAt(i);
			i++;
			setTimeout(typeQuestion, 150);
		}
		else if(i == pageContent.data.privacyquestion.length) {
			i = 0;
			// Fade out the question before performing the zoom.
			fadeQuestion();
		}
	}

	var j = 1.0;
	function fadeQuestion() {
		if(j > 0){
			document.getElementById("privacymodal").style.opacity = j;
			j = j - 0.05;
			setTimeout(fadeQuestion, 50);
		}
		else{
			zoomSys = setInterval(zoomFunc, 200);
			document.getElementById("privacymodal").style.opacity = 0;
		}
	}

	// Start typing out the question.
	typeQuestion();


}

// Animation of zooming in map.
function zoomFunc() {
	if(map.getZoom() < 13){
		map.setZoom(map.getZoom()+1);
	}
	else{
		clearInterval(zoomSys);
		document.getElementById("privacymodal").innerHTML = "";
		setTimeout(nextQuestion, 4000);
	}
}

// Fade back to black and add more content.
var c = 0;
function nextQuestion() {
	if (c < 1 ) {
	document.getElementById("privacymodal").style.opacity = c;
	c = c + 0.05;
	setTimeout(nextQuestion, 50);
	}
	else {
		document.getElementById("privacymodal").style.opacity = 1;
		setTimeout(moreFindings, 1000);
	}
}

var i = 0;
function moreFindings() {
		if(i == 0) {
			document.getElementById("privacymodal").innerHTML = "";
			document.getElementById("privacymodal").innerHTML += pageContent.data.gotitright.charAt(i);
			i++;
			setTimeout(moreFindings, 50);
		}
		else if (i < pageContent.data.gotitright.length) {
			document.getElementById("privacymodal").innerHTML += pageContent.data.gotitright.charAt(i);
			i++;
			setTimeout(moreFindings, 50);
		}
		else {
			// Populate the table list of navigator data.
			i = 0;
			setTimeout(navigatorPopulate, 2000);
		}
}

function navigatorPopulate() {
	if (i == 0){
		document.getElementById("privacymodal").innerHTML = "";
		document.getElementById("privacymodal").innerHTML += pageContent.data.privacymore.charAt(i);
		i++;
		setTimeout(navigatorPopulate, 50);
	}
	else if (i < pageContent.data.privacymore.length){
		document.getElementById("privacymodal").innerHTML += pageContent.data.privacymore.charAt(i);
		i++;
		setTimeout(navigatorPopulate, 50);
	}
	else{
		writeContent();
	}
}


function writeContent() {
	document.getElementById("os").innerHTML += pageContent.data.operatingsystem + navigator.platform;


	document.getElementById("battery").innerHTML += pageContent.data.battery;

	(async () => {
		const battery = await navigator.getBattery();
		const battery_level = `${battery.level * 100}%`;
		document.getElementById("battery").innerHTML += " " + battery_level;
		batteryPopulated = 1;
	})();

	i = 0;
	setTimeout(privacyArticle(),3000);
}

function privacyArticle() {
	if (i < 1){
		document.getElementById("manifestolink").innerHTML = pageContent.data.claim;
		document.getElementById("manifestolink").style.opacity = i;
		i = i + 0.5;
		setTimeout(privacyArticle, 50);
	}
	else{
		document.getElementById("manifestolink").style.opacity = 1;
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
		zoom: 2});
	},1000);
}
