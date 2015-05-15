"use strict";

module.exports = {
	// Get
	get: function(request, render) {
		let user = request.user;
		
		// Render the page
		render({
			user: user
		});
	}
};