"use strict";

let riak = require("nodiak").getClient();
let JavaScriptPhase = require("../../modules/JavaScriptPhase");
let mapPhase = new JavaScriptPhase("pages/search/map.js");

module.exports = {
	// Get
	get: function(request, response) {
		let user = request.user;

		if(!user) {
			response.render()
			return
		}

		user.isStaff = user.accessLevel === "admin" || user.accessLevel === "staff"

		if(!user.isStaff) {
			response.render({
				user
			})
			return
		}

		riak.mapred.inputs("Accounts").map(mapPhase).execute(function(err, results) {
			if(err)
				console.error(err);

			let stages = {};
			let students = results.data;

			students.forEach(function(student) {
				if(!student.applicationDate && student.stage === "apply")
					return;

				if(!stages[student.stage]) {
					stages[student.stage] = [student]
				} else {
					stages[student.stage].push(student)
				}
			});

			// Render the page
			response.render({
				user,
				stages
			});
		});
	}
};