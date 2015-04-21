"use strict";

module.exports = {
	get: function(request, render) {
		var user = request.user;
		
		render({
			user: user
		});
	}
};