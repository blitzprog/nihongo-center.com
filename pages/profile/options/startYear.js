"use strict";

module.exports = function() {
	let currentYear = new Date().getFullYear();
	let years = {};
	years[currentYear] = currentYear.toString();
	years[currentYear + 1] = (currentYear + 1).toString();
	return years;
};