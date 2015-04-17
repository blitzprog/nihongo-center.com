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

// Save
var save = function() {
	var $this = $(this);
	var key = $this.attr("name");
	var value = $this.val();
	var className = $this.attr("class");
	var dataType = "text";
	
	if(className === "number-input") {
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

// Save array element
var saveArrayElement = function() {
	var $this = $(this);
	var array = $this.data("array");
	var index = $this.data("index");
	var key = $this.data("key");
	var value = $this.val();
	var className = $this.attr("class");
	var dataType = "text";
	
	if(className === "array-number-input") {
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

// Save object
var saveObject = function() {
	var $this = $(this);
	var object = $this.data("object");
	var key = $this.data("key");
	var value = $this.val();
	var className = $this.attr("class");
	var dataType = "text";
	
	if(className === "object-number-input") {
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

// On content loaded
var onContentLoaded = function() {
	document.removeEventListener("DOMContentLoaded", onContentLoaded);
	
	$("select").change(save);
	$(".text-input").change(save);
	$(".date-input").blur(save);
	$(".tel-input").change(save);
	$(".number-input").change(save);
	$(".object-number-input").change(saveObject);
	$(".array-text-input").change(saveArrayElement);
	$(".array-number-input").change(saveArrayElement);
};

// Add
var add = function(type) {
	$.post("/raw/profile", {
		function: "add" + type
	}, function(response) {
		updateContent(response);
	});
};

// Remove
var remove = function(type, index) {
	$.post("/raw/profile", {
		function: "remove" + type,
		index: index
	}, function(response) {
		updateContent(response);
	});
};

document.addEventListener("DOMContentLoaded", onContentLoaded);