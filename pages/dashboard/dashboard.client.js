window.sendApplication = function(email, name) {
	var host = "https://my.nihongo-center.com";

	$.post("/api/apply", {
		host,
		email,
		name
	}).then(function(response) {
		$.post("/_/", {
			email: email
		}).then(function(saveResponse) {
			location.reload();
		});
	});
};