"use strict";

let
	multer = require("multer"),
	path = require("path"),
	fs = require("fs-extra");

module.exports = function(aero) {
	const kiloByte = 1024 * 1024;
	const megaByte = 1024 * kiloByte;
	
	aero.app.use(multer({
		dest: "./uploads/",
		/*changeDest: function(dest, req, res) {
			if(typeof req.user === "undefined") {
				console.error("User is undefined on file upload");
				return dest;
			}
			
			let uploadPath = path.join(dest, req.user.email);
			
			fs.ensureDirSync(uploadPath, function(error) {
				if(error)
					throw error;
			});
			
			return uploadPath;
		},*/
		limits: {
			fileSize: 20 * megaByte,
			files: 1,
			fields: 1,
			fieldNameSize: 100
		},
		putSingleFilesInArray: true
	}));
};