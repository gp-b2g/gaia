document.addEventListener('DOMContentLoaded', function(){

	//  Triggers
	var exit_edit =  document.getElementById("exit-edit"),
	show_status =  document.getElementById("show-status"),
	toggle_confirm =  document.querySelectorAll("[data-toggle='confirm']");

	// Receivers
	var status =  document.getElementById("status"),
	confirm =  document.getElementById("confirm");

	// Hide edit
	exit_edit.addEventListener('click', function() {
		window.location.hash = "#";
		e.preventDefault();
	});

	// Show status
	show_status.addEventListener('click', function(e) {
		status.classList.toggle("hide")
		e.preventDefault();
	});

	// Show confirm
	for ( var i = 0; i < toggle_confirm.length; i++ ) {
		toggle_confirm[i].addEventListener('click', function(e) {
			confirm.classList.toggle("hide")
			e.preventDefault();
		});
	}

	window.alert("Pixel ratio: "+window.devicePixelRatio + "width: "+ window.innerWidth+"height: "+window.innerHeight)



});
