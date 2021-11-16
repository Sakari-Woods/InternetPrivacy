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

	// Scan local network map.
	scanLocalNetwork();

	// Populate network card with found connections after 3 seconds.
	setTimeout(function(){
		// Render out a visualization of the user's port-80 visible local network.
		visualizeNetwork();
	},3000);
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
      time: null,
      lat: null,
      long: null,
      weather: null,
      census: [],
	  fdivorced: null,
	  fmarried: null,
	  fnmarried: null,
	  fwidowed: null,
	  mdivorced: null,
	  mmarried: null,
	  mnmarried: null,
	  mwidowed: null,
    }
	weather();
	//console.log(wData.weather)
	console.log(wData.lat)

	census();
    
    function weather(){
		var coords = document.cookie.split(" ");
		var lat = coords[1].substring(coords[1].lastIndexOf('=')+1,coords[1].length-1); 
		var long = coords[2].substring(coords[2].lastIndexOf('=')+1,coords[2].length);
    	wData.lat = lat;
		wData.long = long;
	var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly" + "&appid=209f024f18b94911ca5d243388fea797";
    $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) { 
			console.log(response);
			wData.weather = response.current.weather[0];
			console.log(wData.weather)
			wData.time = response.dt;
			console.log(wData.time)
			$("#icon").empty(iconSelector(response.current.weather[0].icon));       
			$("#icon").append(iconSelector(response.current.weather[0].icon));
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
			return data;
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
			wData.census = responds.results[0].fields.acs;
			wData.fdivorced = Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Divorced'].percentage * 100),
			console.log(wData.fdivorced);
			wData.fmarried = Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Now married'].percentage * 100),
			wData.fnmarried = Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Never married'].percentage * 100)
			wData.fwidowed = Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Widowed'].percentage * 100),
			chart();
			wData.mdivorced = Math.round(responds.results[0].fields.acs.families['Marital status']['Male: Divorced'].percentage * 100),
			wData.mmarried = Math.round(responds.results[0].fields.acs.families['Marital status']['Male: Now married'].percentage * 100),
			wData.mnmarried = Math.round(responds.results[0].fields.acs.families['Marital status']['Male: Never married'].percentage * 100)
			wData.mwidowed = Math.round(responds.results[0].fields.acs.families['Marital status']['Male: Widowed'].percentage * 100),
			chart2();
			$("#fmedian").text(responds.results[0].fields.acs.demographics.Sex.Female.percentage * 100 + "% of population female");
			$("#mmedian").text(responds.results[0].fields.acs.demographics.Sex.Male.percentage * 100  + "% of population male");
			$("#amedian").text(responds.results[0].fields.acs.demographics['Median age'].Total.value + " years is the average age");
			$("#economics").text(responds.results[0].fields.acs.economics['Median household income'].Total.value + " dollars annually is the average household income")
			$("#latino").text((responds.results[0].fields.acs.demographics['Race and ethnicity']['Hispanic or Latino'].percentage * 100).toFixed(1) + "% chance you identify as Hispanic or Latino");
			$("#white").text((responds.results[0].fields.acs.demographics['Race and ethnicity']['Not Hispanic or Latino: White alone'].percentage * 100).toFixed(1) + "% chance you identify as Caucasian");
			$("#black").text((responds.results[0].fields.acs.demographics['Race and ethnicity']['Not Hispanic or Latino: Black or African American alone'].percentage * 100).toFixed(1) + "% chance you identify as Black or African American");
			$("#asian").text((responds.results[0].fields.acs.demographics['Race and ethnicity']['Not Hispanic or Latino: Asian alone'].percentage * 100).toFixed(1) + "% chance you identify as Asian");
			// $("#female").text("As a woman you are ")
			// $("#female").append(Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Divorced'].percentage * 100) + "% likely to be divorced, ")
			// $("#female").append(Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Now married'].percentage * 100) + "% likely to be married, ")
			// $("#female").append(Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Never married'].percentage * 100) + "% likely to have not been married and ")
			// $("#female").append(Math.round(responds.results[0].fields.acs.families['Marital status']['Female: Widowed'].percentage * 100) + "% likely to be widowed")
				
		})
		
	}
	function chart() { 
	$("#chartContainer").CanvasJSChart({ 
		title: { 
			text: "Women's Marital Status",
			fontSize: 16
		}, 
		axisY: { 
			title: "Products in %" 
		}, 
		legend :{ 
			verticalAlign: "center", 
			horizontalAlign: "right" 
		}, 
		height: 150,
		animationEnabled: true,
		data: [ 
		{ 
			type: "doughnut", 
			innerRadius: "40%",
			showInLegend: true, 
			toolTipContent: "{label} <br/> {y} %", 
			indexLabel: "{y} %", 
			dataPoints: [ 
				{ label: "Divorced",  y: wData.fdivorced, legendText: "Divorced"}, 
				{ label: "Married",    y: wData.fmarried, legendText: "Married"  }, 
				{ label: "Never Married",    y: wData.fnmarried, legendText: "Never Married"  }, 
				{ label: "Widowed",    y: wData.fwidowed, legendText: "Widowed"  }, 

			] 
		} 
		] 
	}); 
}
function chart2() { 
	$("#chartContainer2").CanvasJSChart({ 
		title: { 
			text: "Men's Marital Status",
			fontSize: 16
		}, 
		axisY: { 
			title: "Products in %" 
		}, 
		legend :{ 
			verticalAlign: "center", 
			horizontalAlign: "right" 
		}, 
		height: 150,
		animationEnabled: true,
		data: [ 
		{ 
			type: "doughnut", 
			innerRadius: "40%",
			showInLegend: true, 
			toolTipContent: "{label} <br/> {y} %", 
			indexLabel: "{y} %", 
			dataPoints: [ 
				{ label: "Divorced",  y: wData.mdivorced, legendText: "Divorced"}, 
				{ label: "Married",    y: wData.mmarried, legendText: "Married"  }, 
				{ label: "Never Married",    y: wData.mnmarried, legendText: "Never Married"  }, 
				{ label: "Widowed",    y: wData.mwidowed, legendText: "Widowed"  }, 
			] 
		} 
		] 
	}); 
}
})

 // Hold the starting and ending times of the scans.
startScan = [];
endScan = [];
foundConnections = [];
connectionCount = 0;

// Checks the local sub-network of the user from 0-255, and returns the ip addresses with an exposed port 80.
// Realistically, this will be the user's own computer, the router they're connected to and potentially a printer.
async function fetchAsync (url,i) {
	try{
		let response = await fetch(url);
	}
	catch(err){
		endScan[i] = Date.now();
		if((endScan[i] - startScan[i]) < 2000){
			foundConnections[connectionCount] = url;
			connectionCount++;
		}
	}
}

function scanLocalNetwork(){
	for(let i=0;i<255;i++){
		startScan[i] = Date.now();
		fetchAsync("//192.168.1."+i,i);
	}
}
function visualizeNetwork(){
var json = {
	"nodes": [],
	"links": []
};

var i = 0;
var routerConnection = 0;
for(i=0;i<foundConnections.length;i++){
	console.log("Adding connection "+foundConnections[i]);
	// If the connection ends in .1, we have found the router.
	if(foundConnections[i].endsWith('.1')){
		json.nodes[i] = {"id": i, "name": foundConnections[i].substring(2), "image": "https://win98icons.alexmeub.com/icons/png/modem-5.png"};
		routerConnection = i;
	}
	else{
		json.nodes[i] = {"id": i, "name": foundConnections[i].substring(2), "image": "https://win98icons.alexmeub.com/icons/png/computer-5.png"};
	}
}

// Now link the found connections.
for(i=0;i<foundConnections.length;i++){
	json.links[i] = {"source":routerConnection, "target": i};
}

var width = 500,
    height = 200

var svg = d3.select("#NetworkVisual").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(0.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);

// Perform the render.
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  node.append("image")
      .attr("xlink:href", function(d) { return d.image; })
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
}
