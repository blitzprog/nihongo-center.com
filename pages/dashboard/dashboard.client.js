window.sendApplication = function(id, name) {
	let host = 'https://my.nihongo-center.com'

	$.post('/_/api/apply', {
		host,
		id,
		name
	}).then(function(response) {
		$.post('/_/', {
			id
		}).then(function() {
			location.reload()
		})
	})
}