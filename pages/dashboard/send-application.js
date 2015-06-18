function sendApplication(email, name) {
	var host = "http://my.nihongo-center.com";
	
	$.post("https://hooks.slack.com/services/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", {
		payload: JSON.stringify({
			text: "<" + host + "/students/" + email + "|" + name + ">"
		})
	}, function(response) {
		$.post("/raw/", {
			email: email
		}, function(saveResponse) {
			location.reload();
		});
	});
};