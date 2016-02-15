/*eslint-env browser, jquery */
/*global aero*/

// Save
window.save = function() {
	var page = "profile";
	var key = this.name;
	var value = this.value;
	var dataType = "text";

	if(this.classList.contains("number-input")) {
		value = parseInt(value);
		dataType = "numeric";
	}

	$.post("/_/" + page, {
		function: "saveProfile",
		key: key,
		value: value,
		dataType: dataType
	}).then(function(response) {
		window.updateContent(page, response);
	});
};

// Save array element
window.saveArrayElement = function() {
	var page = "profile";
	var array = this.dataset.array;
	var index = this.dataset.index;
	var key = this.dataset.key;
	var value = this.value;
	var dataType = "text";

	if(this.classList.contains("array-number-input")) {
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
	}).then(function(response) {
		window.updateContent(page, response);
	});
};

// Save object
window.saveObject = function() {
	var page = "profile";
	var object = this.dataset.object;
	var key = this.dataset.key;
	var value = this.value;
	var dataType = "text";

	if(this.classList.contains("object-number-input")) {
		value = parseInt(value);
		dataType = "numeric";
	}

	$.post("/_/" + page, {
		function: "saveObject",
		object: object,
		key: key,
		value: value,
		dataType: dataType
	}).then(function(response) {
		window.updateContent(page, response);
	});
};

// On content loaded
jQuery("select").change(save);
jQuery(".text-input").change(save);
jQuery(".date-input").blur(save);
jQuery(".tel-input").change(save);
jQuery(".number-input").change(save);
jQuery(".object-number-input").change(saveObject);
jQuery(".array-text-input").change(saveArrayElement);
jQuery(".array-number-input").change(saveArrayElement);