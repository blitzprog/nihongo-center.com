let defaultUserData = require('../data/user-data.js')

app.auth.facebook = {
	login: function*(fb) {
		console.log(fb)

		let email = fb.email || ''

		return Object.assign({}, defaultUserData, {
			id: email,
			email,
			accounts: {
				facebook: fb.id
			}
		})
	}
}