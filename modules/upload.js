"use strict";

let multer = require("multer");

module.exports = function(aero) {
	aero.app.use(multer({
		dest: "./uploads/",
		putSingleFilesInArray: true
	}));
};