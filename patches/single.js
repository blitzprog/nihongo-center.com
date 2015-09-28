"use strict";

// Database
let riak = require("nodiak").getClient();

let email = "ing.mohamed.samy@gmail.com";

riak.bucket("Accounts").objects.get(email, function(err, obj) {
	if(err) {
		console.log(err);
		return;
	}
	
	let student = obj.data;
	student.startYear = "2016";
	obj.save();
});