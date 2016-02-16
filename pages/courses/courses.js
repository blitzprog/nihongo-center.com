"use strict";

let riak = require("nodiak").getClient();
let JavaScriptPhase = require("../../modules/JavaScriptPhase");
let mapPhase = new JavaScriptPhase("pages/search/map.js");

module.exports = {
	// Get
	get: function(request, response) {
		let user = request.user;

		riak.mapred.inputs("Accounts").map(mapPhase).execute(function(err, results) {
			if(err)
				console.error(err, err.stack);

			let courses = {};
			let students = results.data;

			students.forEach(function(student) {
				if(!student.applicationDate)
					return;

				let startYear = parseInt(student.startYear);
				let startMonth = parseInt(student.startMonth);

				if(!courses[startYear]) {
					courses[startYear] = {
						[startMonth]: [student]
					};
				} else {
					if(courses[startYear][startMonth])
						courses[startYear][startMonth].push(student);
					else
						courses[startYear][startMonth] = [student];
				}
			});

			// Render the page
			response.render({
				user,
				courses
			});
		});
	}
};
