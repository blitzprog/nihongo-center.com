window.saveStage = function(email, stageName) {
	console.log(email, stageName)

	$.post('/_/student/' + email, {
		func: 'saveStage',
		email,
		stageName
	}).then(response => {
		location.reload()
	})
}