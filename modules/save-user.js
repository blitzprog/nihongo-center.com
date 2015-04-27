"use strict";

// Save user in database
module.exports = function(user, callBack) {
	// Connect
	var riak = require("nodiak").getClient();
	var userBucket = riak.bucket("Accounts");
	var userObject = userBucket.objects.new(user.email, user);
	
	// Save account in database
	userObject.save(function(err, obj) {
		if(err) {
			console.error(err);
			return;
		}
		
		if(callBack)
			callBack(obj);
	});
};