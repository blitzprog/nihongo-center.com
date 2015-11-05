"use strict";

let saveUserInDB = require("./save-user");

module.exports = {
	// Add (generic)
	add: function(requestHandler, request, response, key, obj) {
		request.user[key].push(obj);
		saveUserInDB(request.user);
		requestHandler.get(request, response);
	},

	// Remove (generic)
	remove: function(requestHandler, request, response, key) {
		var removedItem = request.user[key].splice(request.body.index, 1)[0];
		saveUserInDB(request.user);
		requestHandler.get(request, response);
		return removedItem;
	}
};