exports.get = function*(request, response) {
	let user = request.user

	if(!user) {
		response.render()
		return
	}

	// Access level check
	if(user.accessLevel !== 'admin' && user.accessLevel !== 'staff') {
		response.render()
		return
	}

	let staff = yield db.filter('Users', user => user.accessLevel === 'admin' || user.accessLevel === 'staff')

	staff = staff.map(member => {
		member.permaLink = '/student/' + member.email
		return member
	})

	response.render({
		user,
		staff
	})
},

// Add staff member
exports.post = function*(request, response) {
	if(!request.body.email) {
		response.end()
		return
	}

	let record = yield db.get('EmailToUser', request.body.email)
	let member = yield db.get('Users', record.userId)

	if(member.accessLevel === 'admin') {
		response.end()
		return
	}

	member.accessLevel = 'staff'
	yield db.saveUser(member)

	response.end()
}