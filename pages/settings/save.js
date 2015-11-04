/*eslint-env browser, jquery */
/*global aero*/

// Save language
var saveLanguage = function(languageCode) {
	var page = "settings";

	$.post("/_/" + page, {
		function: "saveLanguage",
		languageCode: languageCode
	}, function(response) {
		location.reload();
	});
};