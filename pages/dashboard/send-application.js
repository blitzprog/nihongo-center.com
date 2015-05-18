function sendApplication(email, name) {
	var host = "http://localhost:3002";
	
	$.post("https://hooks.slack.com/services/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", {
		payload: JSON.stringify({
			text: "<" + host + "/students/" + email + "|" + name + ">"
		})
	}, function(response) {
		console.log(response);
		//updateContent(page, response);
	});
};