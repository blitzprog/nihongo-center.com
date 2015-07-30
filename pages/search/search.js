"use strict";

module.exports = {
	get: function(request, render) {
		let user = request.user;
		
		// Logged in?
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		render({
			user,
			keyword: request.params.keyword
		});
	}
};