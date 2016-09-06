module.exports = {
	// Get
	get: function(request, response) {
		let user = request.user

		if(user)
			user.isStaff = user.accessLevel === 'admin' || user.accessLevel === 'staff'

		// Render the page
		response.render({
			user,
			languages: {
				'en': 'English',
				'fr': 'Français',
				'zh': '繁體中文'
			}
		})
	},

	// Post: Save to database
	post: function(request, response) {
		if(!request.body || !request.body.func) {
			response.writeHead(400)
			response.end()
			return
		}

		this[request.body.func](request, response)
	},

	// Save language
	saveLanguage: function(request, response) {
		let user = request.user
		user.language = request.body.languageCode
		db.saveUser(user).then(() => response.end())
	}
}
