"use strict";

module.exports = {
	get: function(request, render) {
		var user = request.user;
		
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		render({
			user: user,
			displayName: user.givenName + " " + user.familyName
		});
	}
};