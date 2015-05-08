"use strict";

let saveUserInDB = require("./save-user");

module.exports = {
	// Add (generic)
	add: function(requestHandler, request, render, key, obj) {
		request.user[key].push(obj);
		saveUserInDB(request.user);
		requestHandler.get(request, render);
	},
	
	// Remove (generic)
	remove: function(requestHandler, request, render, key) {
		var removedItem = request.user[key].splice(request.body.index, 1)[0];
		saveUserInDB(request.user);
		requestHandler.get(request, render);
		return removedItem;
	}
};