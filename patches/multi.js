"use strict";

let riak = require("nodiak").getClient();
let JavaScriptPhase = require("../modules/JavaScriptPhase");
let saveUserInDB = require("../modules/save-user.js");
let mapPhase = new JavaScriptPhase("pages/search/map.js");

riak.mapred.inputs("Accounts").map(mapPhase).execute(function(err, results) {
	if(err)
		console.error(err);

	let students = results.data;
	
	students.forEach(function(student) {
		if(student.course == "5") {
			console.log(student.email);
			student.course = "";
			saveUserInDB(student);
		}
	});
});