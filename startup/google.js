let shortid = require('shortid')
let defaultUserData = require('../data/user-data.js')

app.auth.google = {
	login: function*(google) {
		let email = google.emails.length > 0 ? google.emails[0].value.replace('@googlemail.com', '@gmail.com') : ''

		try {
			let record = yield Promise.any([
				db.get('GoogleToUser', google.id),
				db.get('EmailToUser', email)
			])

			let user = yield db.get('Users', record.userId)

			// Existing user
			if(user && user.accounts)
				user.accounts.google = google.id

			db.set('GoogleToUser', google.id, {
				id: google.id,
				userId: user.id
			})

			console.log(`Existing user ${chalk.yellow(user.profile.givenName)} ${chalk.yellow(user.profile.familyName)} logged in`)

			return user
		} catch(_) {
			// New user
			let id = shortid.generate()
			let user = Object.assign({}, defaultUserData, {
				id,
				email,
				language: google.language || '',
				registration: (new Date()).toISOString(),
				accounts: {
					google: google.id
				}
			})

			Object.assign(user.profile, {
				contactEmail: email,
				givenName: google.name.givenName,
				familyName: google.name.familyName,
				gender: google.gender,
				birthDay: google.birthday,
				occupation: google.occupation
			})

			db.set('GoogleToUser', google.id, {
				id: google.id,
				userId: user.id
			})

			db.set('EmailToUser', email, {
				id: email,
				userId: user.id
			})

			console.log(`New user logged in: ${chalk.yellow(user.profile.givenName)} ${chalk.yellow(user.profile.familyName)} (${user.email}) | ID ${user.id}`)
			app.sendRegistrationMessageToSlack(user)

			return user
		}
	}
}