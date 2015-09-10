"use strict";

let riak = require("nodiak").getClient();
let age = require("../../modules/age");
let JavaScriptPhase = require("../../modules/JavaScriptPhase");
let getStudentProgress = require("../../modules/get-student-progress");
let mapPhase = new JavaScriptPhase("pages/search/map.js");

let searchProperties = {
	givenName: true,
	familyName: true,
	gender: true,
	startYear: true,
	country: true,
	jlptLevel: true
};

module.exports = {
	get: function(request, render) {
		let user = request.user;
		let term = request.params.keyword;
		
		if(!term)
			term = "*";
		else
			term = term.toLowerCase();
		
		// Logged in?
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		riak.mapred.inputs("Accounts").map(mapPhase).execute(function(err, results) {
			if(err)
				console.error(err);

			let students = results.data.map(function(student) {
				if(term !== "*") {
					var found = Object.keys(student).some(function(key) {
						var value = student[key];
						
						if(value === null)
							return false;
						
						if(typeof value !== "string")
							return false;
						
						if(!searchProperties[key])
							return false;
						
						if(key === "gender" && value !== term)
							return false;
						
						if(value.toLowerCase().indexOf(term) !== -1)
							return true;
						
						return false;
					});
					
					// Name: Western style
					if(!found)
						found = found || (student.givenName + " " + student.familyName).toLowerCase().indexOf(term) !== -1;
					
					// Name: Japanese style
					if(!found)
						found = found || (student.familyName + " " + student.givenName).toLowerCase().indexOf(term) !== -1;
					
					if(!found)
						return null;
				}
				
				student.age = age.of(student);
				student.permaLink = "/students/" + student.email;
				student.profileCompleted = getStudentProgress(student);
				return student;
			}).filter(function(student) {
				return student !== null;
			});
			
			students.sort(function(a, b) {
				let appliedFactor = (b.applicationDate !== null) - (a.applicationDate !== null);
				let progressFactor = b.profileCompleted - a.profileCompleted;
				//let registeredFactor = (Date.parse(b.registrationDate) > Date.parse(a.registrationDate)) * 2 - 1;
				let courseFactor = 0;
				
				if(a.startYear && b.startYear) {
					if(b.startYear === a.startYear && a.startMonth && b.startMonth)
						courseFactor = Math.sign(parseInt(b.startMonth) - parseInt(a.startMonth));
					else
						courseFactor = Math.sign(parseInt(b.startYear) - parseInt(a.startYear));
				}
				
				return courseFactor + progressFactor * 2 + appliedFactor * 4;
			});

			render({
				user: user,
				students: students
			});
		});
	}
};