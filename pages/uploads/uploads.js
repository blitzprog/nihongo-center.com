"use strict";

var saveUserInDB = require("../../modules/save-user");

module.exports = {
	get: function(request, render) {
		var user = request.user;
		
		render({
			user: user
		});
	},
	
	post: function(request, render) {
		var passportPhoto = request.files.passportPhoto;
		request.user.passportPhoto = passportPhoto;
		
		saveUserInDB(request.user);
		this.get(request, render);
	}
};