"use strict";

let fs = require("fs");
let riak = require("nodiak").getClient();
let saveUserInDB = require("../../modules/save-user");
let getStudentProgress = require("../../modules/get-student-progress");
let getStatistics = require("../../modules/get-statistics");
let JavaScriptPhase = require("../../modules/JavaScriptPhase");

let statisticsMapPhase = new JavaScriptPhase("pages/dashboard/statistics-map.js");

module.exports = {
	get: function(request, render) {
		let user = request.user;
		
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		let missingFields = [];
		let progress = getStudentProgress(user, missingFields);
		
		// Uploads
		let uploads = {};
		user.uploads.forEach(function(upload) {
			uploads[upload.purpose] = true;
		});
		
		let requiredUploads = [
			"passport",
			"passportPhoto",
			"curriculumVitae",
			"pledge",
			"diploma",
			"letterOfGuarantee"
		];
		
		if(user.course === "10 weeks")
			requiredUploads.splice(requiredUploads.indexOf("diploma"), 1);
		
		if(user.accessLevel === "admin" || user.accessLevel === "staff") {
			riak.mapred.inputs("Accounts").map(statisticsMapPhase).execute(function(err, result) {
				if(err)
					console.error(err);
				
				let statistics = getStatistics(result.data);
				
				statistics.countriesSorted = Object.keys(statistics.countries).sort(function(a, b){
					return statistics.countries[b] - statistics.countries[a];
				});
				
				let pieChartData = statistics.countriesSorted.map(function(country) {
					return "[\"" + country + "\", " + statistics.countries[country] + "]"
				}).join(", ");
				
				statistics.script = "var countryToStudents = [[\"Country\", \"Students\"], " + pieChartData + "];";
				
				render({
					user,
					statistics,
					displayName: user.givenName
				});
			});
		} else {
			render({
				user,
				displayName: user.givenName, //+ " " + user.familyName,
				profileCompleted: progress,
				uploads,
				missingFields,
				studentVisaRequired: (user.course && user.course !== "10 weeks"),
				readyToApply: (progress >= 100) && requiredUploads.map(function(purpose) {
					return uploads[purpose] === true;
				}).reduce(function(a, b) {
					return a && b;
				})
			});
		}
	},
	
	// Save application date
	post: function(request, render) {
		request.user.applicationDate = (new Date()).toISOString();
		saveUserInDB(request.user);
		
		render();
	}
};