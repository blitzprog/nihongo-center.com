let inputField = $('search')

window.oldTerm = null
window.oldAjaxRequest = null

window.search = function(e) {
	if(e !== 'force-search') {
		if(!e)
			e = window.event

		let keyCode = e.keyCode || e.which

		if(keyCode !== 13)
			return
	}

	let term = inputField.value

	// Don't repeat the same search
	if(term === window.oldTerm)
		return

	window.oldTerm = term
	localStorage.searchTerm = term

	let queryUrl = ''

	if(!term)
		term = '*'

	let $searchResult = $('searchResult')
	$searchResult.innerHTML = `<div style="width: 100%; text-align: center;">Searching for: <strong>${term}</strong></div>`
	$.fadeIn($('loading-animation'))

	window.oldAjaxRequest = $.get('/_/students/search/' + term).then(function(data) {
		$searchResult.innerHTML = data
		$.ajaxifyLinks($searchResult)
		$.fadeOut($('loading-animation'))
	})
}

if(localStorage.searchTerm)
	inputField.value = localStorage.searchTerm

inputField.focus()
if(inputField.value)
	window.search('force-search')