"use strict";

module.exports = {
	get: function(request) {
		var user = request.user;
		
		if(typeof user === "undefined")
			return undefined;
		
		return {
			user: user,
			displayName: user.givenName + " " + user.familyName
		};
	}
};