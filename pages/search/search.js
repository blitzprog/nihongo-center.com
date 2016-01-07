"use strict";

let riak = require("nodiak").getClient();
let age = require("../../modules/age");
let JavaScriptPhase = require("../../modules/JavaScriptPhase");
let getStudentProgress = require("../../modules/get-student-progress");
let mapPhase = new JavaScriptPhase("pages/search/map.js");
let NodeCache = require('node-cache');
let cache = new NodeCache({
	stdTTL: 300
});

// Country data
let countryData = require("country-data");
let lookup = countryData.lookup;

let searchProperties = {
	givenName: true,
	familyName: true,
	gender: true,
	startYear: true,
	country: true,
	jlptLevel: true
};

module.exports = {
	get: function(request, response) {
		let user = request.user;
		let term = request.params[0];

		if(!term)
			term = "*";
		else
			term = term.toLowerCase();

		// Logged in?
		if(typeof user === "undefined") {
			response.render();
			return;
		}

		cache.get(term, function(error, studentsCached) {
			if(!error && studentsCached !== undefined) {
				response.render({
					user: user,
					students: studentsCached
				});
				return
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
					student.permaLink = "/student/" + student.email;
					student.profileCompleted = getStudentProgress(student);

					if(student.country) {
						let countryObject = lookup.countries({name: student.country})[0];
						if(countryObject)
							student.countryCode = countryObject.alpha2.toLowerCase();
					}

					return student;
				}).filter(function(student) {
					return student !== null;
				});

				students.sort(function(a, b) {
					let appliedFactor = (b.applicationDate !== null) - (a.applicationDate !== null);
					let progressFactor = b.profileCompleted - a.profileCompleted;
					let registeredFactor = Math.sign(Date.parse(b.registrationDate) - Date.parse(a.registrationDate));
					let courseFactor = 0;

					if(a.startYear && b.startYear) {
						if(b.startYear === a.startYear && a.startMonth && b.startMonth)
							courseFactor = Math.sign(parseInt(a.startMonth) - parseInt(b.startMonth));
						else
							courseFactor = Math.sign(parseInt(a.startYear) - parseInt(b.startYear));
					}

					return registeredFactor + courseFactor * 2 + progressFactor * 4 + appliedFactor * 8;
				});

				//if(students.length > 40)
				//	students.length = 40;

				cache.set(term, students, function(error, success) {
					response.render({
						user: user,
						students: students
					});
				});
			});
		});
	}
};
