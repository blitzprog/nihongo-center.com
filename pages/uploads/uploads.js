"use strict";

var saveUserInDB = require("../../modules/save-user");

module.exports = {
	get: function(request, render) {
		var user = request.user;
		
		render({
			user: user,
			fileTypes: [
				{name: "Please choose:", value: "", disabled: true},
				{name: "Passport", value: "passport"},
				{name: "Passport photo", value: "passportPhoto"},
				{name: "CV", value: "curriculumVitae"},
				{name: "Pledge", value: "pledge"},
				{name: "Other", value: "other"}
			]
		});
	},
	
	post: function(request, render) {
		var file = request.files.file[0];
		file.purpose = request.body.purpose;
		file.dateTime = new Date();
		request.user.uploads.unshift(file);
		
		saveUserInDB(request.user);
		this.get(request, render);
	}
};