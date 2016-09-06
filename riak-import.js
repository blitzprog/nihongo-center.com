let shortid = require('shortid')
let defaultUserData = require('./data/user-data')
let aerospike = require('aero-aerospike')
let riak = require('nodiak').getClient()
let db = aerospike.client({
	host: '127.0.0.1:3000',
	namespace: 'nc'
})

let mapPhase = {
	language: 'javascript',
	source: 'function(value) { return [JSON.parse(value.values[0].data)]; }'
}

const directProperties = [
	'email',
	'language',
	'accessLevel',
	'stage',
	'application',
	'registration',
	'uploads'
]

db.connect().then(() => {
	console.log('DB connected')

	riak.mapred.inputs('Accounts').map(mapPhase).execute(function(err, results) {
		if(err) {
			console.error(err)
			return
		}

		let users = results.data

		users.forEach(user => {
			let newUser = Object.assign({}, defaultUserData)
			newUser.id = shortid.generate()

			Object.keys(user).filter(key => directProperties.indexOf(key) === -1).forEach(key => {
				newUser.profile[key] = user[key]
			})

			newUser.email = user.email
			newUser.accessLevel = user.accessLevel
			newUser.stage = user.stage
			newUser.application = user.applicationDate
			newUser.registration = user.registrationDate
			newUser.uploads = user.uploads
			newUser.accounts = {}

			// db.set('EmailToUser', newUser.email, {
			// 	id: newUser.id,
			// 	email: newUser.email
			// })

			// db.set('Users', newUser.id, newUser)

			console.log(newUser)
		})

		console.log(users.length)
	})
})