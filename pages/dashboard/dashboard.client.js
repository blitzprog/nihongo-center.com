window.sendApplication = function(email, name) {
	var host = "https://my.nihongo-center.com";

	$.post("https://hooks.slack.com/services/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", {
		payload: JSON.stringify({
			text: "<" + host + "/student/" + email + "|" + name + ">"
		})
	}).then(function(response) {
		$.post("/_/", {
			email: email
		}).then(function(saveResponse) {
			location.reload();
		});
	});
};