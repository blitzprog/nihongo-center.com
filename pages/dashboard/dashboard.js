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
		
		// Prevent division by zero
		if(fields.length !== 0) {
			let completedFields = fields.map(function(property) {
				if(typeof user[property] === "undefined" || user[property] === "")
					return 0;
				
				return 1;
			}).reduce(function(a, b) {
				return a + b;
			});
			
			progress = Math.round(completedFields / fields.length * 100);
		}
		
		render({
			user: user,
			displayName: user.givenName + " " + user.familyName,
			profileCompleted: progress,
			courseToTitle: this.courseToTitle
		});
	}
};