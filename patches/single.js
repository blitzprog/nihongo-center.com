"use strict";

// Database
let riak = require("nodiak").getClient();

let email = "eva_zeng@foxmail.com";

riak.bucket("Accounts").objects.get(email, function(err, obj) {
	if(err) {
		console.log(err);
		return;
	}
	
	let student = obj.data;
	student.country = "China";
	obj.save();
});