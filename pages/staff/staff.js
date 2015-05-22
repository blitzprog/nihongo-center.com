"use strict";

let riak = require("nodiak").getClient();
let Accounts = riak.bucket("Accounts").objects;

module.exports = {
	get: function(request, render) {
		let user = request.user;
		
		// Logged in?
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		// Access level check
		if(user.accessLevel !== "admin" && user.accessLevel !== "staff") {
			render();
			return;
		}
		
		Accounts.all(function(err, rObjects) {
			if(err)
				throw err;
			
			let staff = rObjects.map(function(rObject) {
				let member = rObject.data;
				
				if(member.accessLevel === "student")
					return null;
				
				member.permaLink = "/students/" + member.email;
				
				return member;
			}).filter(function(member) {
				return member !== null;
			});
			
			render({
				user: user,
				staff: staff
			});
		});
	},
	
	// Add staff member
	post: function(request, render) {
		Accounts.get(request.body.email, function(err, member) {
			if(err) {
				console.error(err);
				render();
				return;
			}
			
			if(member.data.accessLevel === "admin") {
				render();
				return;
			}
			
			// Modify
			member.data.accessLevel = "staff";
			
			// Save
			member.save(function(saveError) {
				if(saveError)
					console.error(saveError);
				
				render();
			});
		});
	}
};