"use strict";

let saveUserInDB = require("../../modules/save-user");

module.exports = {
	// Get
	get: function(request, response) {
		let user = request.user;
		user.isStaff = user.accessLevel === "admin" || user.accessLevel === "staff"

		// Render the page
		response.render({
			user,
			languages: {
				"en": "English",
				"fr": "Français",
				"zh": "繁體中文"
			}
		});
	},

	// Post: Save to database
	post: function(request, response) {
		if(!request.body.function) {
			response.writeHead(400)
			response.end();
			return
		}

		this[request.body.function](request, response);
	},

	// Save language
	saveLanguage: function(request, response) {
		let user = request.user;
		user.language = request.body.languageCode;
		saveUserInDB(user);
		response.end();
	}
};
