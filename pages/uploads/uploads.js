"use strict";

let saveUserInDB = require("../../modules/save-user");
let dbArray = require("../../modules/db-array");
let fs = require("fs");

module.exports = {
	// Get
	get: function(request, render) {
		let user = request.user;
		let __ = request.__;
		
		let fileTypes = [
			{name: __("pleaseChoose"), value: "", disabled: true},
			{name: __("passport"), value: "passport"},
			{name: __("passportPhoto"), value: "passportPhoto"},
			{name: __("curriculumVitae"), value: "curriculumVitae"},
			{name: __("letterOfGuarantee"), value: "letterOfGuarantee"},
			{name: __("diploma"), value: "diploma"},
			{name: __("pledge"), value: "pledge"},
			{name: __("other"), value: "other"}
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