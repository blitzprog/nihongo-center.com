"use strict";

module.exports = {
	// Get
	render: function(request, render) {
		let user = request.user;

		// Render the page
		render({
			user
		});
	}
};
