"use strict";

module.exports = {
	render: function(request, render) {
		let user = request.user;
		
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