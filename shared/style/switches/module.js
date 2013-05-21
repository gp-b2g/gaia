(function() {
console.log("init");

	// Slider
	var rootElm = document.querySelectorAll("[data-type=switch]");

	// Events
	var pressEvent =  ("ontouchstart" in window) ? "touchstart" : "mousedown";
	var moveEvent = ("ontouchstart" in window) ? "touchmove" : "mousemove";
	var releaseEvent = ("ontouchstart" in window) ? "touchend" :"mouseup";


	for (var i = 0; i < rootElm.length; i++) {
		var context = rootElm[i].parentNode;
		var receiverElm = context.querySelector("span");
		var isChecked = rootElm[i].checked;

		var coordinates = { init: 0, current: 0 }

		function move(e) {
			coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;
			var amount = coordinates.current - receiverElm.offsetLeft - receiverElm.offsetWidth;

			// Set limits
			// if ( amount >= 0 || amount <= 0 )
			// 	return;

			if (isChecked) {
				// Allow to move right to left

			} else {
				// Allow to move left to right
			}

			receiverElm.style.backgroundPosition = amount+"px top";
		}

		function start() {
			console.log("press")
			// receiverElm.classList.remove("finish")
			// receiverElm.classList.add("moving")
			context.addEventListener(moveEvent, move);
			context.addEventListener(releaseEvent, end);
		}

		function end() {
			console.log("release")
			receiverElm.style.backgroundPosition = null;
			// receiverElm.classList.remove("moving")
			// receiverElm.classList.add("finish")

			context.removeEventListener(moveEvent, move, false);
			context.removeEventListener(releaseEvent, end, false);
		}

		context.addEventListener(pressEvent, function(e) {
			coordinates.init = (e.touches) ? e.touches[0].pageX : e.clientX;
			start();
		});

	}


})();
