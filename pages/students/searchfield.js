var oldTerm = null;
var oldAjaxRequest = null;

function search(e) {
	var term = $("#search").val();
	
	// Don't repeat the same search
	if(term === oldTerm)
		return;
	
	oldTerm = term;
	
	if(oldAjaxRequest !== null)
		oldAjaxRequest.abort();
	
	var queryUrl = "";
	
	if(!term)
		term = "*";
	
	oldAjaxRequest = $.get("/raw/students/search/" + term, function(data) {
		$("#searchResult").html(data);
	});
}

document.onreadystatechange = search;