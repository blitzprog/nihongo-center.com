"use strict";

var riak = require("nodiak").getClient();

module.exports = {
	get: function(request, render) {
		var user = request.user;
		
		// Logged in?
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		// Access level check
		if(user.accessLevel !== "admin") {
			render();
			return;
		}
		
		riak.bucket("Accounts").objects.all(function(err, rObjects) {
			if(err)
				throw err;
				
			render({
				students: rObjects.map(function(student) {
					return student.data;
				})
			});
		});
	}
};