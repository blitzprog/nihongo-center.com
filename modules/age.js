"use strict";

module.exports = {
	// Of
	of: function(user) {
		return this.getAge(new Date(user.birthDay));
	},
	
	// Get age
	getAge: function(d1, d2) {
		d2 = d2 || new Date();
		let diff = d2.getTime() - d1.getTime();
		return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
	}
};