"use strict";

let riak = require("nodiak").getClient();
let Accounts = riak.bucket("Accounts").objects;
let JavaScriptPhase = require("../../modules/JavaScriptPhase");
let mapPhase = new JavaScriptPhase("pages/staff/map.js");

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
		
		riak.mapred.inputs("Accounts").map(mapPhase).execute(function(err, results) {
			if(err)
				throw err;
			
			let staff = results.data.map(function(member) {
				member.permaLink = "/students/" + member.email;
				return member;
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