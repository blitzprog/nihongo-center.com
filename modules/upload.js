"use strict";

let multer = require("multer");

module.exports = function(aero) {
	const kiloByte = 1024 * 1024;
	const megaByte = 1024 * kiloByte;
	
	aero.app.use(multer({
		dest: "./uploads/",
		limits: {
			fileSize: 20 * megaByte,
			files: 1,
			fields: 1,
			fieldNameSize: 100
		},
		putSingleFilesInArray: true
	}));
};