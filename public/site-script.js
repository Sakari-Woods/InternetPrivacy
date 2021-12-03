// Request/generate the key for the user.
let keyrequest = new XMLHttpRequest("8005");
keyrequest.open('GET', '/key');
keyrequest.responseType = 'json';
keyrequest.send();
keyrequest.onload = function(){
	//TODO potentially refactor keyData to look at document.cookie instead.
	const keyData = keyrequest.response;

	setTimeout(initMap,1000);

	// Activate zooming map.
	zoomSys = setInterval(zoomFunc, 200);

	// Scan local network map.
	setTimeout(scanLocalNetwork,3000);

	// Populate network card with found connections after 3 seconds.
	setTimeout(function(){
		// Render out a visualization of the user's port-80 visible local network.
		visualizeNetwork();
	},6000);
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
		if(userData && userData.lat && userData.lon){
		//var coords = document.cookie.split(" ");
		//var latVal = coords[1].substring(coords[1].lastIndexOf('=')+1,coords[1].length); 
		//var lngVal = coords[2].substring(coords[2].lastIndexOf('=')+1,coords[2].length);
		var latVal = userData.lat;
		var lngVal = userData.lon; 

		map = new google.maps.Map(document.getElementById('map'), {
		mapId: "6476ad7bfe7aa057",
		center: {lat: parseFloat(latVal), lng: parseFloat(lngVal)},	
		disableDefaultUI: true,
		zoomControl: false,
		zoom: 2});
		}
		else{
			console.log("Could not initialize map, no coordinates available.");
		}
	},1000);

}

// Below this comment is the JQuery to handle API requests
$(window).on("load",function() {
    var wData = {
	  key: "",
      lat: null,
      long: null,
      weather: null,
      census: [],
	  less: null, fifteen: null, twenty: null, twentyfive: null, thirty: null, thirtyfive: null, forty: null, fortyfive: null,
	  fifty: null, sixty: null, seventyfive: null, hundred: null, hundred25: null, hundred50: null, twohundred: null, more: null,
	  under18: null, aThirty: null, aForty: null, aFifty: null, aSixty: null, aSeventy: null, aEighty5: null, over: null
    }
	setTimeout(weather,2000);
	setTimeout(census,2000);
    battery();

	function battery() {
		navigator.getBattery()
		.then(function(battery) {
			//console.log('battery:',battery.level);
			var batteryPercent = Math.round(100*battery.level)+"%";
			$('.progress-bar-fill').delay(1000).queue(function () {
				$(this).css('width', batteryPercent)
			});
			$("#batteryPercent").text(batteryPercent)
		});
	}

    function weather(){
		var coords = document.cookie.split(" ");
		if(userData && userData.lat && userData.lon){
			//var lat = coords[1].substring(coords[1].lastIndexOf('=')+1,coords[1].length-1); 
			//var long = coords[2].substring(coords[2].lastIndexOf('=')+1,coords[2].length);
			var lat = userData.lat;
			var long = userData.lon;
			wData.lat = lat;
			wData.long = long;
		var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly" + "&appid=209f024f18b94911ca5d243388fea797";
		$.ajax({
			url: queryURL,
			method: "GET"
			}).then(function(response) { 
				//console.log(response);
				wData.weather = response.current.weather[0];
				// response.current.weather[0].main = "Clouds";
				//console.log(wData.weather)
				$("#icon").empty(iconSelector(response.current.weather[0].icon));       
				$("#icon").append(iconSelector(response.current.weather[0].icon));
				if (response.current.weather[0].main === "Rain"){
					$("#sell").text("Buy a head umbrella to stay dry and keep your hands free so you can deal with everyday life with both hands. $12.99 can change your entire life.")
					$("#pic1").attr("src","images/chrome-capture (4).jpg");
					$("#pic2").attr("src","images/chrome-capture (5).jpg");
				} 	else if (response.current.weather[0].main === "Clouds"){
					$("#sell").text("Buy a hoody to stay warm in this cooler then normal weather. $24.99 and you can have this incredibly comfortable and stylish outerwear")
					$("#pic1").attr("src","images/chrome-capture (6).jpg");
					$("#pic2").attr("src","images/chrome-capture (7).jpg");
				} 	else if (response.current.weather[0].main === "Mist"){
					$("#sell").text("Come in for a hot coffee or cocoa on a dreary day like this. Our joy comes from your happiness!")
					$("#pic1").attr("src","images/chrome-capture (8).jpg");
					$("#pic2").attr("src","images/chrome-capture (9).jpg");
				}	else if (response.current.weather[0].main === "Clear"){
					$("#sell").text("A nice pair of shades to protect your eyes from the higher UV's on this bright sunny day. Buy these stylish sunglasses for just $199.")
					$("#pic1").attr("src","images/chrome-capture (10).jpg");
					$("#pic2").attr("src","images/chrome-capture (11).jpg");
				}	else if (response.current.weather[0].main === "Thunderstorm"){
					$("#sell").text("Buy these electric proof golf clubs and golf in any weather. for just $24,999 you can safely golf in the worst lightning storms. Our patented composite design is the only safe way to guarantee your game. If you are electrocuted while holding these clubs within 3 years of purchase you get a full refund.")
					$("#pic1").attr("src","images/chrome-capture (12).jpg");
					$("#pic2").attr("src","images/chrome-capture (13).jpg");
				}	else if (response.current.weather[0].main === "Drizzle"){
					$("#sell").text("A raincoat would be perfect today, and we have them in all styles and sizes. They are made from wool and cotton and dyes completely safe for the environment, we promise.")
					$("#pic1").attr("src","images/chrome-capture (14).jpg");
					$("#pic2").attr("src","images/chrome-capture (15).jpg");
				}	else if (response.current.weather[0].main === "Snow"){
					$("#sell").text("Since we know global warming is a farce and the reality is snowpocalypse is on its way, we want to help you survive the coming cold armageddon. For $250,000(per person) we will give you a kit guaranteed to keep you alive for 3 years at temperatures as low as -20 fahrenheit.")
					$("#pic1").attr("src","images/chrome-capture (17).jpg");
					$("#pic2").attr("src","images/chrome-capture (18).jpg");
				}
				//return data;
			});
		}
		else{
			console.log("Could not render weather.");
		}
    }
  	function iconSelector(icon){
    	var iconImg = $("<img>");
    	var iconUrl = "https://openweathermap.org/img/wn/";   
    	iconImg.attr("src", iconUrl + icon + "@2x.png");
    	return iconImg;
	}
	function census(){
		//var coords = document.cookie.split(" ");
		//var lat = coords[1].substring(coords[1].lastIndexOf('=')+1,coords[1].length-1); 
		//var long = coords[2].substring(coords[2].lastIndexOf('=')+1,coords[2].length);
		var lat = userData.lat;
		var lon = userData.lon;
		queryURL = "https://api.geocod.io/v1.6/reverse?q="+lat+","+lon+"&fields=acs-demographics,acs-economics,acs-families,acs-housing,acs-social&api_key=33f164f47278768378338225572873f34154186"
		$.ajax({
			url: queryURL,
			method: "GET"
        }).then(function(responds) {
			//console.log(responds);
			wData.census = responds.results[0].fields.acs;
			wData.less = Math.round(responds.results[0].fields.acs.economics['Household income']['Less than $10,000'].percentage * 100),
			wData.fifteen = Math.round(responds.results[0].fields.acs.economics['Household income']['$10,000 to $14,999'].percentage * 100),
			wData.twenty = Math.round(responds.results[0].fields.acs.economics['Household income']['$15,000 to $19,999'].percentage * 100),
			wData.twentyfive = Math.round(responds.results[0].fields.acs.economics['Household income']['$20,000 to $24,999'].percentage * 100),
			wData.thirty = Math.round(responds.results[0].fields.acs.economics['Household income']['$25,000 to $29,999'].percentage * 100),
			wData.thirtyfive = Math.round(responds.results[0].fields.acs.economics['Household income']['$30,000 to $34,999'].percentage * 100),
			wData.forty = Math.round(responds.results[0].fields.acs.economics['Household income']['$35,000 to $39,999'].percentage * 100),
			wData.fortyfive = Math.round(responds.results[0].fields.acs.economics['Household income']['$40,000 to $44,999'].percentage * 100),
			wData.fifty = Math.round(responds.results[0].fields.acs.economics['Household income']['$45,000 to $49,999'].percentage * 100),
			wData.sixty = Math.round(responds.results[0].fields.acs.economics['Household income']['$50,000 to $59,999'].percentage * 100),
			wData.seventyfive = Math.round(responds.results[0].fields.acs.economics['Household income']['$60,000 to $74,999'].percentage * 100),
			wData.hundred = Math.round(responds.results[0].fields.acs.economics['Household income']['$75,000 to $99,999'].percentage * 100),
			wData.hundred25 = Math.round(responds.results[0].fields.acs.economics['Household income']['$100,000 to $124,999'].percentage * 100),
			wData.hundred50 = Math.round(responds.results[0].fields.acs.economics['Household income']['$125,000 to $149,999'].percentage * 100),
			wData.twohundred = Math.round(responds.results[0].fields.acs.economics['Household income']['$150,000 to $199,999'].percentage * 100),
			wData.more = Math.round(responds.results[0].fields.acs.economics['Household income']['$200,000 or more'].percentage * 100),
			wData.under18 = Math.round(((responds.results[0].fields.acs.demographics['Population by age range']['Female: 5 to 9 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 10 to 14 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 15 to 17 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 5 to 9 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 10 to 14 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 15 to 17 years'].percentage)) * 50),
			wData.aThirty = Math.round(((responds.results[0].fields.acs.demographics['Population by age range']['Female: 18 and 19 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 20 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 21 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 22 to 24 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 25 to 29 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 18 and 19 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 20 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 21 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 22 to 24 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 25 to 29 years'].percentage)) * 50),
			wData.aForty = Math.round(((responds.results[0].fields.acs.demographics['Population by age range']['Female: 30 to 34 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 35 to 39 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 30 to 34 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 35 to 39 years'].percentage)) * 50),
			wData.aFifty = Math.round(((responds.results[0].fields.acs.demographics['Population by age range']['Female: 40 to 44 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 45 to 49 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 40 to 44 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 45 to 49 years'].percentage)) * 50),
			wData.aSixty = Math.round(((responds.results[0].fields.acs.demographics['Population by age range']['Female: 50 to 54 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 55 to 59 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 50 to 54 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 55 to 59 years'].percentage)) * 50),
			wData.aSeventy = Math.round(((responds.results[0].fields.acs.demographics['Population by age range']['Female: 60 and 61 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 62 to 64 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 65 and 66 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 67 to 69 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 60 and 61 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 62 to 64 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 65 and 66 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 67 to 69 years'].percentage)) * 50),
			wData.aEighty5 = Math.round(((responds.results[0].fields.acs.demographics['Population by age range']['Female: 70 to 74 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 75 to 79 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Female: 80 to 84 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 70 to 74 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 75 to 79 years'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 80 to 84 years'].percentage)) * 50),
			wData.over = Math.round(((responds.results[0].fields.acs.demographics['Population by age range']['Female: 85 years and over'].percentage) +
										(responds.results[0].fields.acs.demographics['Population by age range']['Male: 85 years and over'].percentage)) * 50)
			
			chart();
			chart2();
			$("#amedian").text(responds.results[0].fields.acs.demographics['Median age'].Total.value + " years is the average age"),
			$("#economics").text("$" + responds.results[0].fields.acs.economics['Median household income'].Total.value + " annually is the average household income")
			
			})
	function chart() { 
	$("#chartContainer").CanvasJSChart({ 
		title: { 
			text: "Household incomes",
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
				{ label: "Less than $10,000",  y: wData.less, legendText: "Less than $10,000"}, 
				{ label: "$10,000-$19,999",    y: (wData.fifteen + wData.twenty), legendText: "$10,000-$19,999"  },
				{ label: "$20,000-$29,999",    y: (wData.twentyfive + wData.thirty), legendText: "$20,000-$29,999"  },
				{ label: "$30,000-$39,999",    y: (wData.thirtyfive + wData.forty), legendText: "$30,000-$39,999"  },
				{ label: "$40,000-$49,999",    y: (wData.fortyfive + wData.fifty), legendText: "$40,000-$49,999"  },
				{ label: "$50,000-$59,999",    y: wData.sixty, legendText: "$50,000-$59,999"  },
				{ label: "$60,000-$74,999",    y: wData.seventyfive, legendText: "60,000-$74,999"  },
				{ label: "$75,000-$124,999",    y: (wData.hundred + wData.hundred25), legendText: "$75,000-$124,999"  },
				{ label: "$125,000-$199,999",    y: (wData.hundred50 + wData.twohundred), legendText: "$125,000-$199,999"  },
				{ label: "$200,000 or more",    y: wData.more, legendText: "$200,000 or more"  }, 
			] 
		} 
		] 
	});
	}
}
function chart2() { 
	$("#chartContainer2").CanvasJSChart({ 
		title: { 
			text: "Population percentage by age",
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
				{ label: "Under 18",  y: wData.under18, legendText: "Under 18"}, 
				{ label: "18 - 29",    y: wData.aThirty, legendText: "18 - 29"  }, 
				{ label: "30 - 39",    y: wData.aForty, legendText: "30 - 39"  }, 
				{ label: "40 - 49",    y: wData.aFifty, legendText: "40 - 49"  }, 
				{ label: "50 - 59",  y: wData.aSixty, legendText: "50 - 59"}, 
				{ label: "60 - 69",    y: wData.aSeventy, legendText: "60 - 69"  }, 
				{ label: "70 - 84",    y: wData.aEighty5, legendText: "70 - 84"  }, 
				{ label: "85 and over",    y: wData.over, legendText: "85 and over"  }, 
			] 
		} 
		] 
	}); 
}
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
  }
//sleep(100);
//   keyBuild();
//   function keyBuild(){
// 	  for (i = 4; i < document.cookie.length - 28; i++){
// 		  wData.key += document.cookie[i];
// 	  }
// 	  console.log(wData.key);
//   }
  if (wData.key != 0){
	  $.post("/data",
	  {
		 key: wData.key,
		 lat: wData.lat,
		 long: wData.long
	  },
	  function (data, status) {
		 console.log(data);
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
