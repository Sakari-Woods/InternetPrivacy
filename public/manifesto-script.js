// This sets the pageContent variable for later use.
let request = new XMLHttpRequest();
request.open('GET', 'http://sakaribox.ddns.net/sitecontent');
request.responseType = 'json';
request.send();
var pageContent;

request.onload = function(){
	const jsonText = request.response;
	pageContent = jsonText;
	document.getElementById("articletitle").innerHTML = pageContent.data.articletitle;
	document.getElementById("articlebody").innerHTML = pageContent.data.articlebody;

	// Populate the manifesto rules.
	document.getElementById("rule1").innerHTML = pageContent.data.rule1;
	document.getElementById("rule2").innerHTML = pageContent.data.rule2;
	document.getElementById("rule3").innerHTML = pageContent.data.rule3;
	document.getElementById("rule4").innerHTML = pageContent.data.rule4;
	document.getElementById("rule1c").innerHTML = pageContent.data.rule1c;
	document.getElementById("rule2c").innerHTML = pageContent.data.rule2c;
	document.getElementById("rule3c").innerHTML = pageContent.data.rule3c;
	document.getElementById("rule4c").innerHTML = pageContent.data.rule4c;
}
