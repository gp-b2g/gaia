// HTTP request
var Http = function(url, callback, error, data) {
	var req = new XMLHttpRequest();
	var method = (data) ? "POST" : "GET";

	req.open(method, url, true);
	req.setRequestHeader('User-Agent','XMLHTTP/1.0');

	if (data) {
		req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	}

	req.onreadystatechange = function () {
		if (req.readyState != 4) return;
		callback(req.response)
	};

	if (req.readyState == 4) return;
	req.send(data);
};


Http('app.html', function(response) {

	var newBody = response.split("<body>")[1];
	newBody = newBody.split("</body>")[0];

	var lazy = document.createElement("script");
	lazy.src = "js/lazyload.js";
	lazy.onload = function(){
		console.log("lazy is here mom!")
		contentReceiver.innerHTML = newBody;

		// Start lazyloading
		var appStyles = ['shared/style/responsive.css',
						'shared/style/headers.css',
						'shared/style/buttons.css',
						'shared/style/switches.css',
						'shared/style/input_areas.css',
						'shared/style_unstable/seekbars.css',
						'shared/style_unstable/tabs.css',
						'shared/style_unstable/lists.css',
						'shared/style_unstable/drawer.css',
						'css/bb-override.css',
						'css/layout.css',
						'css/views.css',
						'css/content.css'];

		var appScripts = ['js/templates.js',
						'js/views.js',
						'js/ui.js',
						'js/ready.js'];

		lazyLoad(appScripts,appStyles);
	};
	document.head.appendChild(lazy)

});
