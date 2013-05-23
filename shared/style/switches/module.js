(function() {

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

		// String value for  background position
		var position = "";

		// Px to determine non-intentional user movements
		var threshold = 3;

		// limit = draggable area - handler width
		var coordinates = { init: 0, current: 0, limit: 31 }

		function move(e) {
			coordinates.current = (e.touches) ? e.touches[0].pageX : e.clientX;
			rawAmount = coordinates.current - coordinates.init;

			if (isChecked) {
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

			receiverElm.classList.add("no-transition");

			context.addEventListener(moveEvent, move);
			context.addEventListener(releaseEvent, end);
		}

		function end() {
			console.log("release")

			// true when user is just trying to press & release w/o movment
			var isPressAndRelease = (rawAmount <= 0 + threshold && rawAmount >= 0 - threshold);

			// Intentional user movement
			if (!isPressAndRelease) {
				var toCheck = (amount < (coordinates.limit / 2) * -1)
				receiverElm.classList.remove("no-transition");
				receiverElm.classList.add("no-animation");

				// Determine if has to be checked or not
				if (toCheck) {
					// Uncheck
					checkbox.checked = false;
					receiverElm.style.backgroundPosition = "right top";

				} else {
					// Check
					checkbox.checked = true;
					receiverElm.style.backgroundPosition = "left top";
				}

				var finish = function() {
					receiverElm.classList.add("no-transition");
					(toCheck) ? receiverElm.style.backgroundPosition = "left bottom" : receiverElm.style.backgroundPosition = "left center";
					receiverElm.removeEventListener("transitionend", finish);
				}

				receiverElm.addEventListener("transitionend", finish);
			} else {
				// Clean modified stuff on press&release
				receiverElm.style.backgroundPosition = null;
				receiverElm.classList.remove("no-animation");
				receiverElm.classList.remove("no-transition");
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
