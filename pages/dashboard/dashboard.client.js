window.sendApplication = function(email, name) {
	let host = 'https://my.nihongo-center.com'

	$.post('/_/api/apply', {
		host,
		email,
		name
	}).then(function(response) {
		$.post('/_/', {
			email
		}).then(function() {
			location.reload()
		})
	})
}