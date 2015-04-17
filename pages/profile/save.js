/*eslint-env browser, jquery */
/*global aero*/

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

var onContentLoaded = function() {
	document.removeEventListener("DOMContentLoaded", onContentLoaded);
	
	var save = function() {
		var $this = $(this);
		var key = $this.attr("name");
		var value = $this.val();
		var className = $this.attr("class");
		var dataType = "text";
		
		if(className === "number-input" || className === "object-number-input") {
			value = parseInt(value);
			dataType = "numeric";
		}
		
		$.post("/raw/profile", {
			function: "saveProfile",
			key: key,
			value: value,
			dataType: dataType
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
		var className = $this.attr("class");
		var dataType = "text";
		
		if(className === "number-input" || className === "object-number-input") {
			value = parseInt(value);
			dataType = "numeric";
		}
		
		$.post("/raw/profile", {
			function: "saveArrayElement",
			array: array,
			index: index,
			key: key,
			value: value,
			dataType: dataType
		}, function(response) {
			updateContent(response);
		});
	};
	
	var saveObject = function() {
		var $this = $(this);
		var object = $this.data("object");
		var key = $this.data("key");
		var value = $this.val();
		var className = $this.attr("class");
		var dataType = "text";
		
		if(className === "number-input" || className === "object-number-input") {
			value = parseInt(value);
			dataType = "numeric";
		}
		
		$.post("/raw/profile", {
			function: "saveObject",
			object: object,
			key: key,
			value: value,
			dataType: dataType
		}, function(response) {
			updateContent(response);
		});
	};
	
	$("select").change(save);
	$(".text-input").change(save);
	$(".date-input").blur(save);
	$(".tel-input").change(save);
	$(".number-input").change(save);
	$(".object-number-input").change(saveObject);
	$(".array-text-input").change(saveArrayElement);
};

var addFamilyMember = function() {
	$.post("/raw/profile", {
		function: "addFamilyMember"
	}, function(response) {
		updateContent(response);
	});
};

var removeFamilyMember = function(index) {
	$.post("/raw/profile", {
		function: "removeFamilyMember",
		index: index
	}, function(response) {
		updateContent(response);
	});
};

document.addEventListener("DOMContentLoaded", onContentLoaded);