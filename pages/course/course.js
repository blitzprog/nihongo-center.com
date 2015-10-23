"use strict";

let riak = require("nodiak").getClient();
let JavaScriptPhase = require("../../modules/JavaScriptPhase");
let mapPhase = new JavaScriptPhase("pages/search/map.js");

module.exports = {
	// Get
	get: function(request, render) {
		let user = request.user;
		let year = parseInt(request.params.year);
		let month = parseInt(request.params.month);
		
		riak.mapred.inputs("Accounts").map(mapPhase).execute(function(err, results) {
			if(err)
				console.error(err);
			
			let course = {
				students: []
			};
			
			let students = results.data;
			students.forEach(function(student) {
				let startYear = parseInt(student.startYear);
				let startMonth = parseInt(student.startMonth);
				
				if(startYear === year && startMonth === month)
					course.students.push(student);
			});
			
			// Render the page
			render({
				user,
				year,
				month,
				course
			});
		});
	}
};