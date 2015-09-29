"use strict";

let riak = require("nodiak").getClient();
let JavaScriptPhase = require("../../modules/JavaScriptPhase");
let mapPhase = new JavaScriptPhase("pages/search/map.js");

module.exports = {
	// Get
	get: function(request, render) {
		let user = request.user;
		
		riak.mapred.inputs("Accounts").map(mapPhase).execute(function(err, results) {
			if(err)
				console.error(err);
			
			let courses = {};
			let students = results.data;
			
			students.forEach(function(student) {
				if(!student.applicationDate)
					return;
				
				let startYear = parseInt(student.startYear);
				let startMonth = parseInt(student.startMonth);
				let key = startYear;
				
				if(courses[key])
					courses[key].push(student);
				else
					courses[key] = [student];
			});
			
			// Render the page
			render({
				user,
				courses
			});
		});
	}
};