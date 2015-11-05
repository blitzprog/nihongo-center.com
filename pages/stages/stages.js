"use strict";

module.exports = {
	// Get
	get: function(request, response) {
		let user = request.user;

		// Render the page
		response.render({
			user
		});
	}
};
