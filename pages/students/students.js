"use strict";

module.exports = {
	render: function(request, render) {
		let user = request.user;

		// Logged in?
		if(typeof user === "undefined") {
			render();
			return;
		}

		// Access level check
		if(user.accessLevel !== "admin" && user.accessLevel !== "staff") {
			render();
			return;
		}

		render({
			user: user
		});
	}
};
