var background = document.createElement("iframe");
background.src ="app.html";
background.onload = function() {
	console.log("APP: 		"+Date.now());

	var loadApp = window.location.href.split("/")
	loadApp.pop()
	loadApp.push("app.html")
	loadApp = loadApp.join("/")
	// window.location.href = loadApp;
}
document.body.appendChild(background)
