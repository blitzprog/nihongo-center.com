"use strict";

let riak = require("nodiak").getClient();
let JavaScriptPhase = require("../modules/JavaScriptPhase");
let saveUserInDB = require("../modules/save-user.js");
let mapPhase = new JavaScriptPhase("pages/search/map.js");

//let americaSynonyms = ["America", "U.S.A", "U.S.A.", "USA"];

riak.mapred.inputs("Accounts").map(mapPhase).execute(function(err, results) {
	if(err)
		console.error(err);

	let students = results.data;

	students.forEach(function(student) {
		student.uploads.forEach(function(upload) {
			upload.destination = upload.destination.replace("uploads/", "upload/")
			upload.path = upload.path.replace("uploads/", "upload/")
		})

		console.log(student.email);
		saveUserInDB(student);

		/*if(americaSynonyms.indexOf(student.country) !== -1) {
			console.log(student.email);
			student.country = "United States";
			saveUserInDB(student);
		}*/
	});
});