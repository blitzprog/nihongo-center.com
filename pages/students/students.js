"use strict";

var riak = require("nodiak").getClient();
var age = require("../../modules/age");

module.exports = {
	get: function(request, render) {
		var user = request.user;
		
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
				
			var students = rObjects.map(function(rObject) {
				var student = rObject.data;
				
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