var onContentLoaded = function() {
	document.removeEventListener("DOMContentLoaded", onContentLoaded);
	
	var save = function() {
		var $this = $(this);
		var key = $this.attr("name");
		var value = $this.val();
		
		$.post("/raw/profile", {
			key: key,
			value: value
		}, function(response) {
			var focusedElementId = $(document.activeElement).attr("id");
			
			aero.$content.html(response);
			aero.fireContentLoadedEvent();
			
			// Re-focus previously selected element
			if(typeof focusedElementId !== "undefined")
				$("#" + focusedElementId).focus();
			
			// Remove from cache
			delete aero.cache["profile"];
		});
	};
	
	$(".text-input").change(save);
	$(".date-input").blur(save);
	$("select").change(save);
};

document.addEventListener("DOMContentLoaded", onContentLoaded);