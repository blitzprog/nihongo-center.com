/*eslint-env browser, jquery */
/*global aero*/

function saveStage(email, stageName) {
	console.log(email, stageName);

	$.post("/_/students/" + email, {
		function: "saveStage",
		email: email,
		stageName: stageName
	}, function(response) {
		location.reload();
	});
}