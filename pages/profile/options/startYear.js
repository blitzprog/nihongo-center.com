"use strict";

let currentYear = new Date().getFullYear();

module.exports = [
	{name: "Please choose:", value: "", disabled: true},
	{name: currentYear, value: currentYear.toString()},
	{name: currentYear + 1, value: (currentYear + 1).toString()}
];