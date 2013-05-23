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

		// Amount of px moved by the user
		var rawAmount = 0;

		// Calculated from rawAmount, the backgorund position in px
		var amount = 0;

		// Px to determine non-intentional movements
		var threshold = 3;

		// limit = draggable area - handler width
		var coordinates = { init: 0, current: 0, limit: 31 }

		function move(e) {
			coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;
			rawAmount = coordinates.current - coordinates.init;

			if (isChecked && amount < 0) {
				// Allow to move right to left
				amount = rawAmount;
			} else {
				// Allow to move left to right
				amount =  rawAmount - coordinates.limit;
			}

			receiverElm.style.backgroundPosition = amount+"px top";
		}

		function start() {
			console.log("press")

			// Determine if the checkbox was checked before press
			isChecked = checkbox.checked;

			// Ensure that the initial amount is always 0
			rawAmount = 0;
			amount = 0;

			// receiverElm.classList.remove("finish")
			// receiverElm.classList.remove("moving")
			context.addEventListener(moveEvent, move);
			context.addEventListener(releaseEvent, end);
		}

		function end() {
			console.log("release")

			// true when user is just trying to press & release w/o movment
			var isPressAndRelease = (rawAmount <= 0 + threshold && rawAmount >= 0 - threshold);
			console.log(rawAmount)
			if (!isPressAndRelease) {
				// Intentional user movement
				var toCheck = (amount < (coordinates.limit / 2) * -1)
				var finish = function() {
					receiverElm.style.backgroundPosition = null;
					receiverElm.classList.remove("finish");
					// receiverElm.classList.add("moving");
					receiverElm.removeEventListener("transitionend", finish);
				};

				// Determine if has to be checked or not
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
