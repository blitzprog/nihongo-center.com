/*eslint-env browser, jquery */
/*global aero*/

window.saveStage = function(email, stageName) {
	console.log(email, stageName);

	$.post("/_/student/" + email, {
		function: "saveStage",
		email: email,
		stageName: stageName
	}).then(function(response) {
		location.reload();
	});
};