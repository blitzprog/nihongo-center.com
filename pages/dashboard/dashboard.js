"use strict";

module.exports = {
	get: function(request) {
		var user = request.user;
		
		if(typeof user === "undefined")
			return undefined;
		
		var progress = 0;
		var fields = Object.keys(user);
		
		// Prevent division by zero
		if(fields.length !== 0) {
			var completedFields = fields.map(function(property) {
				if(typeof user[property] === "undefined" || user[property] === "")
					return 0;
				
				return 1;
			}).reduce(function(a, b) {
				return a + b;
			});
			
			progress = Math.round(completedFields / fields.length * 100);
		}
		
		return {
			user: user,
			displayName: user.givenName + " " + user.familyName,
			profileCompleted: progress
		};
	}
};