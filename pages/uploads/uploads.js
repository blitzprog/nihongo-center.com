"use strict";

let saveUserInDB = require("../../modules/save-user");
let dbArray = require("../../modules/db-array");
let fs = require("fs");

module.exports = {
	// Get
	get: function(request, render) {
		let user = request.user;
		let fileTypes = [
			{name: "", value: "", disabled: true},
			{name: "", value: "passport"},
			{name: "", value: "passportPhoto"},
			{name: "", value: "curriculumVitae"},
			{name: "", value: "letterOfGuarantee"},
			{name: "", value: "diploma"},
			{name: "", value: "pledge"},
			{name: "", value: "other"}
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
		let file = request.file;
		
		if(file && request.body.purpose) {
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