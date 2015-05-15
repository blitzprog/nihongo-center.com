"use strict";

let saveUserInDB = require("../../modules/save-user");
let dbArray = require("../../modules/db-array");
let fs = require("fs");

module.exports = {
	// Get
	get: function(request, render) {
		let user = request.user;
		let fileTypes = [
			{name: "Please choose:", value: "", disabled: true},
			{name: "Passport", value: "passport"},
			{name: "Passport photo", value: "passportPhoto"},
			{name: "Curriculum Vitae", value: "curriculumVitae"},
			{name: "Letter of Guarantee", value: "letterOfGuarantee"},
			{name: "Diploma", value: "diploma"},
			{name: "Pledge", value: "pledge"},
			{name: "Other", value: "other"}
		];
		
		// Create an inverted dictionary based on fileTypes
		let purposeToName = fileTypes.reduce(function(previous, current) {
			let key = current.value;
			let value = current.name;
			
			if(key)
				previous[key] = value;
			
			return previous;
		}, {});
		
		// Render the page
		render({
			user: user,
			fileTypes: fileTypes,
			purposeToName: purposeToName
		});
	},
	
	// Post
	post: function(request, render) {
		// Delete requests
		if(typeof request.body.function !== "undefined") {
			render(this[request.body.function](request, render));
			return;
		}
		
		// File uploads
		let files = request.files.file;
		
		if(files && files.length > 0 && request.body.purpose) {
			let file = files[0];
			file.purpose = request.body.purpose;
			file.dateTime = new Date();
			
			request.user.uploads.unshift(file);
			saveUserInDB(request.user);
		}
		
		this.get(request, render);
	},
	
	// Remove upload
	removeUpload: function(request, render) {
		var removedFile = dbArray.remove(this, request, render, "uploads");
		fs.unlink(removedFile.path, function() {
			console.log("Deleted uploaded file: " + removedFile.path);
		});
	}
};