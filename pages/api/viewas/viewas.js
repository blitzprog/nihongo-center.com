exports.post = function*(request, response) {
	let user = request.user

	if(user && user.viewedBy)
		user = user.viewedBy

	if(!user || user.accessLevel === 'student') {
		response.writeHead(400)
		return response.end('Not authorized')
	}

	user.viewAs = request.params[0] || ''

	yield db.saveUser(user)
	response.end()
}