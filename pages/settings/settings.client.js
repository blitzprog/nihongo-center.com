/*eslint-env browser, jquery */
/*global kaze*/

// Save language
window.saveLanguage = function(languageCode) {
	$.post("/_/settings", {
		function: "saveLanguage",
		languageCode: languageCode
	}).then(function(response) {
		location.reload();
	});
};