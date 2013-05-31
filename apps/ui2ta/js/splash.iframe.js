var background = document.createElement("iframe");
background.src ="app.html";
background.dataset.viewport = "";
background.onload = function() {
	console.log("APP: 		"+Date.now());

	var loadApp = window.location.href.split("/")
	loadApp.pop()
	loadApp.push("app.html")
	loadApp = loadApp.join("/")
	// window.location.href = loadApp;

	// Shows iframe
	background.style.opacity = "1";
}
document.body.appendChild(background)
