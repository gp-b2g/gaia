(function() {
console.log("init");

	// Slider
	var rootElm = document.querySelectorAll("[data-type=switch]");

	// Events
	var pressEvent =  ("ontouchstart" in window) ? "touchstart" : "mousedown";
	var moveEvent = ("ontouchstart" in window) ? "touchmove" : "mousemove";
	var releaseEvent = ("ontouchstart" in window) ? "touchend" :"mouseup";


	for (var i = 0; i < rootElm.length; i++) {

		var checkbox = rootElm[i];
		var context = checkbox.parentNode;
		var receiverElm = context.querySelector("span");
		var isChecked = false;
		var amount = 0;

		// limit = draggable area - handler width
		var coordinates = { init: 0, current: 0, limit: 31 }

		function move(e) {
			coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;
			amount = coordinates.current - coordinates.init;

				console.log(amount)

			if (isChecked && amount < 0) {
				// Allow to move right to left
				console.log("entra")

			} else {
				// Allow to move left to right
				amount =  amount - coordinates.limit;
			}

			receiverElm.style.backgroundPosition = amount+"px top";
		}

		function start() {
			console.log("press")
			isChecked = checkbox.checked;
			// receiverElm.classList.remove("finish")
			// receiverElm.classList.remove("moving")
			context.addEventListener(moveEvent, move);
			context.addEventListener(releaseEvent, end);
		}

		function end() {
			console.log("release")
			var toCheck = (amount < (coordinates.limit / 2) * -1)
			var finish = function() {
				receiverElm.style.backgroundPosition = null;
				receiverElm.classList.remove("finish");
				// receiverElm.classList.add("moving");
				receiverElm.removeEventListener("transitionend", finish);
			};

			if (isChecked && toCheck) {
				// Uncheck
				receiverElm.style.backgroundPosition = (coordinates.limit * -1) + "px top";
				receiverElm.classList.add("finish");
				checkbox.checked = false;

				receiverElm.addEventListener("transitionend",  finish);
			} else {
				// Check
				receiverElm.style.backgroundPosition = 0 + "px top";
				receiverElm.classList.add("finish");
				checkbox.checked = true;
				receiverElm.addEventListener("transitionend",  finish);
			}

			context.removeEventListener(moveEvent, move, false);
			context.removeEventListener(releaseEvent, end, false);
		}

		context.addEventListener(pressEvent, function(e) {
			coordinates.init = (e.touches) ? e.touches[0].pageX : e.clientX;
			start();
		});

	}


})();
