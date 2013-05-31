(function(){
	// HTTP request
	var Http = function(url, callback) {
		var req = new XMLHttpRequest();

		req.open("GET", url, true);
		req.setRequestHeader('User-Agent','XMLHTTP/1.0');

		req.onreadystatechange = function () {
			if (req.readyState != 4) return;
			callback(req.response)
		};

		if (req.readyState == 4) return;
		req.send(null);
	};

	var lazyLoad = function(scripts, styles){

		// Generate styles
		if (styles.length > 0) {
			var styleBoundle = document.createDocumentFragment();
			for ( var i = 0;  i < styles.length; i++ ) {
				var style = document.createElement("link");
				style.rel = "stylesheet";
				style.href = styles[i];
				styleBoundle.appendChild(style);

				if (styles.length - 1 == i) {
					style.onload = function() {
						var done = new CustomEvent("stylesReady", {
								detail: {
									options: styles[i]
								}
							});
						document.dispatchEvent(done);
					};
				}
			}
			document.head.appendChild(styleBoundle);
		}

		// Generate styles
		if (scripts.length > 0) {
			var scriptBoundle = document.createDocumentFragment();
			for ( var i = 0;  i < scripts.length; i++ ) {
				var script = document.createElement("script");
				script.type="text/javascript";
				script.src = scripts[i];
				scriptBoundle.appendChild(script);
			}
			document.head.appendChild(scriptBoundle);
		}
	};


	Http('app.html', function(response) {

		var newBody = response.split("<body>")[1];
		newBody = newBody.split("</body>")[0];

		// Add markup
		document.body.innerHTML += newBody;

		// Add scripts & styles
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

	});

	// Hide splash, then remove it
	document.addEventListener("stylesReady", function() {
		var splashDom = document.getElementById("splash");
		splashDom.addEventListener("transitionend", function end(e){
			if (e.propertyName == "opacity") {
				this.removeEventListener("transitionend", end);
				document.body.removeChild(splashDom);
			}
		});

		// Gecko need some time to render the elements (avoid glitches)
		var delayTransiton = setTimeout(function() {
			splashDom.style.opacity = "0";
		}, 100)

	});

})();


