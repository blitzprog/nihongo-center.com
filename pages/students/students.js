"use strict";

let riak = require("nodiak").getClient();
let age = require("../../modules/age");

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
		
		riak.bucket("Accounts").objects.all(function(err, rObjects) {
			if(err)
				throw err;
				
			let students = rObjects.map(function(rObject) {
				let student = rObject.data;
				
				if(student.accessLevel !== "student")
					return null;
				
				student.age = age.of(student);
				student.permaLink = "/students/" + student.email;
				
				return student;
			}).filter(function(student) {
				return student !== null;
			});
			
			render({
				user: user,
				students: students
			});
		});
	}
};