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

	let term = $('search').value

	// Don't repeat the same search
	if(term === window.oldTerm)
		return

	window.oldTerm = term

	let queryUrl = ''

	if(!term)
		term = '*'

	let $searchResult = $('searchResult')
	$searchResult.innerHTML = '<div style="text-align: center; width: 100%"><img src="/images/loading.svg" alt="Searching..."></div>'

	window.oldAjaxRequest = $.get('/_/students/search/' + term).then(function(data) {
		$searchResult.innerHTML = data
		$.ajaxifyLinks($searchResult)
	})
}

window.search('force-search')
