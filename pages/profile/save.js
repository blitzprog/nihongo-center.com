/*eslint-env browser, jquery */
/*global aero*/

var onContentLoaded = function() {
	document.removeEventListener("DOMContentLoaded", onContentLoaded);
	
	var updateContent = function(response) {
		var focusedElementId = $(document.activeElement).attr("id");
		
		aero.$content.html(response);
		aero.fireContentLoadedEvent();
		
		// Re-focus previously selected element
		if(typeof focusedElementId !== "undefined")
			$("#" + focusedElementId).focus();
		
		// Remove from cache
		delete aero.cache.profile;
	};
	
	var save = function() {
		var $this = $(this);
		var key = $this.attr("name");
		var value = $this.val();
		
		$.post("/raw/profile", {
			function: "saveProfile",
			key: key,
			value: value
		}, function(response) {
			updateContent(response);
		});
	};
	
	var saveArrayElement = function() {
		var $this = $(this);
		var array = $this.data("array");
		var index = $this.data("index");
		var key = $this.data("key");
		var value = $this.val();
		
		$.post("/raw/profile", {
			function: "saveArrayElement",
			array: array,
			index: index,
			key: key,
			value: value
		}, function(response) {
			updateContent(response);
		});
	};
	
	$(".text-input").change(save);
	$(".date-input").blur(save);
	$(".tel-input").change(save);
	$("select").change(save);
	$(".array-text-input").change(saveArrayElement);
};

var addFamilyMember = function() {
	$.post("/raw/profile", {
		function: "addFamilyMember"
	}, function(response) {
		updateContent(response);
	});
};

document.addEventListener("DOMContentLoaded", onContentLoaded);