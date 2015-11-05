"use strict";

module.exports = {
	get: function(request, response) {
		let user = request.user;

		if(typeof user === "undefined") {
			response.render();
			return;
		}

		response.render({
			user: user,
			displayName: user.givenName + " " + user.familyName
		});
	}
};
