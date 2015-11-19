window.oldTerm = null;
window.oldAjaxRequest = null;

window.search = function(e) {
	var term = $("#search").val();

	// Don't repeat the same search
	if(term === window.oldTerm)
		return;

	window.oldTerm = term;

	if(window.oldAjaxRequest !== null)
		window.oldAjaxRequest.abort();

	var queryUrl = "";

	if(!term)
		term = "*";

	var $searchResult = $("#searchResult");
	$searchResult.html("<div style='text-align: center; width: 100%'><img src='/images/loading.svg' alt='Searching...'></div>");

	window.oldAjaxRequest = $.get("/_/students/search/" + term, function(data) {
		$searchResult.html(data);
	});
};

window.search();