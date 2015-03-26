var onContentLoaded = function() {
	document.removeEventListener("DOMContentLoaded", onContentLoaded);
	
	var save = function() {
		var $this = $(this);
		var key = $this.attr("name");
		var value = $this.val();
		
		console.log(key, value);
		
		$.post("/raw/profile", {
			key: key,
			value: value
		}, function(response) {
			aero.$content.html(response);
			aero.fireContentLoadedEvent();
		});
	};
	
	$("input").change(save);
	$("select").change(save);
};

document.addEventListener("DOMContentLoaded", onContentLoaded);