let defaultUserData = require('../data/user-data.js')

app.auth.google = {
	login: function*(google) {
		console.log(google)

		let email = google.emails.length > 0 ? google.emails[0].value : ''

		return Object.assign({}, defaultUserData, {
			id: email,
			email,
			accounts: {
				google: google.id
			}
		})
	}
}