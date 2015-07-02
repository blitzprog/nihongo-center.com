"use strict";

let riak = require("nodiak").getClient();
let age = require("../../modules/age");
let JavaScriptPhase = require("../../modules/JavaScriptPhase");
let mapPhase = new JavaScriptPhase("pages/students/map.js");

module.exports = {
	get: function(request, render) {
		let user = request.user;

		// Logged in?
		if (typeof user === "undefined") {
			render();
			return;
		}

		// Access level check
		if (user.accessLevel !== "admin" && user.accessLevel !== "staff") {
			render();
			return;
		}
		
		riak.mapred.inputs("Accounts").map(mapPhase).execute(function(err, results) {
			if (err)
				console.error(err);

			let students = results.data.map(function(student) {
				student.age = age.of(student);
				student.permaLink = "/students/" + student.email;
				return student;
			});

			render({
				user: user,
				students: students
			});
		});
	}
};