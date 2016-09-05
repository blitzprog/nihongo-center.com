// Update content
window.updateContent = function(page, response) {
	let focusedElementId = document.activeElement.id

	$.setContent(response)
	$.emit('DOMContentLoaded')

	// Re-focus previously selected element
	if(typeof focusedElementId !== 'undefined')
		$(focusedElementId).focus()

	// Remove from cache
	//delete kaze.cache[page]
}

// Add
window.add = function(page, type) {
	$.post('/_/' + page, {
		func: 'add' + type
	}).then(function(response) {
		window.updateContent(page, response)
	})
}

// Remove
window.remove = function(page, type, index) {
	$.post('/_/' + page, {
		func: 'remove' + type,
		index: index
	}).then(function(response) {
		window.updateContent(page, response)
	})
}