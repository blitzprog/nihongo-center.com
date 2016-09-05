/*eslint-env browser, jquery */
/*global kaze*/

// Save language
window.saveLanguage = function(languageCode) {
	$.post('/_/settings', {
		func: 'saveLanguage',
		languageCode: languageCode
	}).then(function(response) {
		location.reload()
	})
}