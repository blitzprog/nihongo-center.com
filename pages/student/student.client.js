window.saveStage = function(id, stageName) {
	console.log(id, stageName)

	$.post('/_/student/' + id, {
		func: 'saveStage',
		id,
		stageName
	}).then(response => {
		location.reload()
	})
}