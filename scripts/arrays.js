// Update content
var updateContent = function(page, response) {
	var focusedElementId = $(document.activeElement).attr("id");

	$(kaze.content).html(response);
	kaze.emit('DOMContentLoaded');

	// Re-focus previously selected element
	if(typeof focusedElementId !== "undefined")
		$("#" + focusedElementId).focus();

	// Remove from cache
	//delete kaze.cache[page];
};

// Add
var add = function(page, type) {
	$.post("/_/" + page, {
		function: "add" + type
	}, function(response) {
		updateContent(page, response);
	});
};

// Remove
var remove = function(page, type, index) {
	$.post("/_/" + page, {
		function: "remove" + type,
		index: index
	}, function(response) {
		updateContent(page, response);
	});
};