"use strict";

// Save user in database
module.exports = function(user, callBack) {
	// Connect
	let riak = require("nodiak").getClient();
	let userBucket = riak.bucket("Accounts");
	let userObject = userBucket.objects.new(user.email, user);

	// Save account in database
	userObject.save(function(err, obj) {
		if(err) {
			console.error(err, err.stack);
			return;
		}

		if(callBack)
			callBack(obj);
	});
};