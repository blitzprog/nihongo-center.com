// Update content
window.updateContent = function(page, response) {
	var focusedElementId = document.activeElement.id;

	aero.setContent(response);
	aero.emit('DOMContentLoaded');

	// Re-focus previously selected element
	if(typeof focusedElementId !== "undefined")
		$(focusedElementId).focus();

	// Remove from cache
	//delete kaze.cache[page];
};

// Add
window.add = function(page, type) {
	$.post("/_/" + page, {
		function: "add" + type
	}).then(function(response) {
		window.updateContent(page, response);
	});
};

// Remove
window.remove = function(page, type, index) {
	$.post("/_/" + page, {
		function: "remove" + type,
		index: index
	}).then(function(response) {
		window.updateContent(page, response);
	});
};