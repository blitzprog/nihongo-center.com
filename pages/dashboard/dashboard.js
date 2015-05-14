"use strict";

let fs = require("fs");

module.exports = {
	courseToTitle: JSON.parse(fs.readFileSync("data/courses.json", "utf8")),
	
	get: function(request, render) {
		let user = request.user;
		
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		let progress = 0;
		let fields = Object.keys(user);
		let notRequiredFields = [
			"email",
			"relativesAbroad",
			"financialSupportPerMonth",
			"addressAbroad",
			"telephoneAbroad",
			"japaneseEducation",
			"uploads"
		];
		let atLeastOneElement = [
			"familyMembers",
			"financialSupporters"
		];
		
		// Prevent division by zero
		if(fields.length !== 0) {
			let notRequiredFieldCount = 0;
			let completedFields = fields.map(function(property) {
				// These don't need to be filled out
				if(notRequiredFields.indexOf(property) !== -1) {
					notRequiredFieldCount += 1;
					return 0;
				}
				
				// Arrays that need at least 1 element
				if(atLeastOneElement.indexOf(property) !== -1 && user[property].length === 0)
					return 0;
				
				if(typeof user[property] === "undefined" || user[property] === "" || user[property] === null)
					return 0;
				
				return 1;
			}).reduce(function(a, b) {
				return a + b;
			});
			
			progress = Math.round(completedFields / (fields.length - notRequiredFieldCount) * 100);
			
			if(progress > 100)
				progress = 100;
		}
		
		render({
			user: user,
			displayName: user.givenName, //+ " " + user.familyName,
			profileCompleted: progress,
			courseToTitle: this.courseToTitle
		});
	}
};