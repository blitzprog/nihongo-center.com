"use strict";

let fs = require("fs");

module.exports = function(filePath) {
	this.language = "javascript";
	this.source = fs.readFileSync(filePath, "utf8");
};