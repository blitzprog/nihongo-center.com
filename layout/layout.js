"use strict";

module.exports = {
	get: function(request, render) {
		let user = request.user;
		
		render({
			user: user
		});
	}
};