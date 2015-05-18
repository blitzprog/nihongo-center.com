"use strict";

let riak = require("nodiak").getClient();
let age = require("../../modules/age");

module.exports = {
	get: function(request, render) {
		console.log(request.body);
		let user = request.user;
		
		// Logged in?
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		// Access level check
		if(user.accessLevel !== "admin") {
			render();
			return;
		}
		
		riak.bucket("Accounts").objects.all(function(err, rObjects) {
			if(err)
				throw err;
				
			let students = rObjects.map(function(rObject) {
				let student = rObject.data;
				
				student.age = age.of(student);
				student.permaLink = "/students/" + student.email;
				
				return student;
			});
			
			render({
				students: students
			});
		});
	}
};