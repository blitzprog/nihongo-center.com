module.exports = {
	// Add (generic)
	add: function(requestHandler, request, response, key, obj) {
		let context = key === 'uploads' ? request.user : request.user.profile
		context[key].push(obj)

		app.db.saveUser(request.user).then(() => requestHandler.get(request, response))
	},

	// Remove (generic)
	remove: function(requestHandler, request, response, key) {
		let context = key === 'uploads' ? request.user : request.user.profile
		let removedItem = context[key].splice(request.body.index, 1)[0]
		app.db.saveUser(request.user).then(() => requestHandler.get(request, response))

		return removedItem
	}
}