/*eslint-env browser, jquery */
/*global aero*/

// Save
var save = function() {
	var page = "profile";
	var $this = $(this);
	var key = $this.attr("name");
	var value = $this.val();
	var dataType = "text";

	if($this.hasClass("number-input")) {
		value = parseInt(value);
		dataType = "numeric";
	}

	$.post("/_/" + page, {
		function: "saveProfile",
		key: key,
		value: value,
		dataType: dataType
	}, function(response) {
		updateContent(page, response);
	});
};

// Save array element
var saveArrayElement = function() {
	var page = "profile";
	var $this = $(this);
	var array = $this.data("array");
	var index = $this.data("index");
	var key = $this.data("key");
	var value = $this.val();
	var dataType = "text";

	if($this.hasClass("array-number-input")) {
		value = parseInt(value);
		dataType = "numeric";
	}

	$.post("/_/" + page, {
		function: "saveArrayElement",
		array: array,
		index: index,
		key: key,
		value: value,
		dataType: dataType
	}, function(response) {
		updateContent(page, response);
	});
};

// Save object
var saveObject = function() {
	var page = "profile";
	var $this = $(this);
	var object = $this.data("object");
	var key = $this.data("key");
	var value = $this.val();
	var dataType = "text";

	if($this.hasClass("object-number-input")) {
		value = parseInt(value);
		dataType = "numeric";
	}

	$.post("/_/" + page, {
		function: "saveObject",
		object: object,
		key: key,
		value: value,
		dataType: dataType
	}, function(response) {
		updateContent(page, response);
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

document.addEventListener("DOMContentLoaded", onContentLoaded);