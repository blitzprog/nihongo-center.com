window.oldTerm = null;
window.oldAjaxRequest = null;

window.search = function(e) {
	if(e !== 'force-search') {
		if(!e)
			e = window.event;

		var keyCode = e.keyCode || e.which;

		if(keyCode !== 13)
			return;
	}

	var term = $("search").value;

	// Don't repeat the same search
	if(term === window.oldTerm)
		return;

	window.oldTerm = term;

	var queryUrl = "";

	if(!term)
		term = "*";

	var $searchResult = $("searchResult");
	$searchResult.innerHTML = "<div style='text-align: center; width: 100%'><img src='/images/loading.svg' alt='Searching...'></div>";

	window.oldAjaxRequest = $.get("/_/students/search/" + term).then(function(data) {
		$searchResult.innerHTML = data;
	});
};

window.search('force-search');