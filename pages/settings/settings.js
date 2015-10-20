"use strict";

let saveUserInDB = require("../../modules/save-user");

module.exports = {
	// Get
	get: function(request, render) {
		let user = request.user;
		
		// Render the page
		render({
			user,
			languages: {
				"en": "English",
				"fr": "Français",
				"zh": "繁體中文"
			}
		});
	},
	
	// Post: Save to database
	post: function(request, render) {
		this[request.body.function](request);
		render();
	},
	
	// Save language
	saveLanguage: function(request) {
		let user = request.user;
		user.language = request.body.languageCode;
		saveUserInDB(user);
	}
};