/*eslint-env browser, jquery */
/*global kaze*/

// Save language
window.saveLanguage = function(languageCode) {
	var page = "settings";

	$.post("/_/" + page, {
		function: "saveLanguage",
		languageCode: languageCode
	}, function(response) {
		location.reload();
	});
};