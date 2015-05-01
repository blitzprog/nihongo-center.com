// Update content
var updateContent = function(page, response) {
	var focusedElementId = $(document.activeElement).attr("id");
	
	aero.$content.html(response);
	aero.fireContentLoadedEvent();
	
	// Re-focus previously selected element
	if(typeof focusedElementId !== "undefined")
		$("#" + focusedElementId).focus();
	
	// Remove from cache
	delete aero.cache[page];
};

// Add
var add = function(page, type) {
	$.post("/raw/" + page, {
		function: "add" + type
	}, function(response) {
		updateContent(page, response);
	});
};

// Remove
var remove = function(page, type, index) {
	$.post("/raw/" + page, {
		function: "remove" + type,
		index: index
	}, function(response) {
		updateContent(page, response);
	});
};