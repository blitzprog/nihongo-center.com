"use strict";

module.exports = function(obj) {
	return Object.keys(obj)
		.map(key => obj[key])
		.reduce((a, b) => a + b);
};