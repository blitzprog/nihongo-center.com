window.viewAs = function(id) {
	$.post('/api/viewas/' + id, {}).then(() => {
		if(id)
			location.href = '/profile'
		else
			location.href = '/students'
	})
}