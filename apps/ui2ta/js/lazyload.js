(function(){

	lazyLoad = function(scripts, styles){

		// Genrate styles
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
	}

})();
