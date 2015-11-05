"use strict";

module.exports = {
	get: function(request, response) {
		let user = request.user;

		// Logged in?
		if(typeof user === "undefined") {
			response.render();
			return;
		}

		// Access level check
		if(user.accessLevel !== "admin" && user.accessLevel !== "staff") {
			response.render();
			return;
		}

		response.render({
			user: user
		});
	}
};
