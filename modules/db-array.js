module.exports = {
	// Add (generic)
	add: function(requestHandler, request, response, key, obj) {
		request.user.profile[key].push(obj)
		app.db.saveUser(request.user).then(() => requestHandler.get(request, response))
	},

	// Remove (generic)
	remove: function(requestHandler, request, response, key) {
		let removedItem = request.user.profile[key].splice(request.body.index, 1)[0]
		app.db.saveUser(request.user).then(() => requestHandler.get(request, response))
		return removedItem
	}
}