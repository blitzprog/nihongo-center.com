"use strict";

let saveUserInDB = require("../../modules/save-user");

module.exports = {
	// Get
	get: function(request, render) {
		let user = request.user;
		
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
	
	// Post
	post: function(request, render) {
		let files = request.files.file;
		
		if(files && files.length > 0) {
			let file = files[0];
			file.purpose = request.body.purpose;
			file.dateTime = new Date();
			
			request.user.uploads.unshift(file);
			saveUserInDB(request.user);
		}
		
		this.get(request, render);
	}
};