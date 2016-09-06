let Promise = require('bluebird')
let shortid = require('shortid')
const defaultUserData = JSON.stringify(require('./data/user-data'))
let aerospike = require('aero-aerospike')
let riak = require('nodiak').getClient('http', '162.243.141.109', 8098)
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
	'applicationDate',
	'registrationDate',
	'uploads'
]

let count = 0

let importUser = user => {
	if(!user.email)
		return;

	let newUser = JSON.parse(defaultUserData)

	for(let key of Object.keys(user)) {
		if(key && directProperties.indexOf(key) === -1) {
			if(user[key])
				newUser.profile[key] = user[key];
		}
	}

	newUser.id = shortid.generate()
	newUser.email = user.email
	newUser.accessLevel = user.accessLevel
	newUser.stage = user.stage
	newUser.application = user.applicationDate
	newUser.registration = user.registrationDate
	newUser.uploads = user.uploads
	newUser.accounts = {}

	Promise.delay(count * 30).then(() => db.set('EmailToUser', newUser.email, {
		id: newUser.email,
		userId: newUser.id
	}))

	Promise.delay(count * 30).then(() => db.set('Users', newUser.id, newUser))

	count++
}

db.connect().then(() => {
	console.log('DB connected')

	riak.mapred.inputs('Accounts').map(mapPhase).execute(function(err, results) {
		if(err) {
			console.error(err)
			return
		}

		let users = results.data

		users.forEach(importUser)

		console.log(count, users.length)
	})
})