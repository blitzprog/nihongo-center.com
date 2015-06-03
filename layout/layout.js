"use strict";

module.exports = {
	render: function(request, render) {
		let user = request.user;
		let pageToGlyphIcon = {
			"dashboard": "dashboard",
			"profile": "user",
			"uploads": "upload",
			"stages": "list",
			"login": "home",
			"students": "book",
			"staff": "flash"
		};
		
		render({
			user,
			pageToGlyphIcon
		});
	}
};