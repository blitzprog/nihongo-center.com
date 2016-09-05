module.exports = {
	get: function(request, response) {
		let user = request.user

		if(typeof user === 'undefined') {
			response.render()
			return
		}

		response.render({
			user,
			displayName: user.profile.givenName + ' ' + user.profile.familyName
		})
	}
}
