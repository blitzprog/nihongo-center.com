"use strict";

let
	multer = require("multer"),
	path = require("path"),
	fs = require("fs-extra"),
	crypto = require("crypto");

module.exports = function(aero) {
	const kiloByte = 1024 * 1024;
	const megaByte = 1024 * kiloByte;
	
	let storage = multer.diskStorage({
		destination: "./uploads/",
		filename: function(req, file, cb) {
			crypto.pseudoRandomBytes(16, function(err, raw) {
				if(err)
					return cb(err);

				cb(null, raw.toString("hex") + path.extname(file.originalname));
			});
		}
	});
	
	aero.app.use(multer({
		storage,
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
	}).single("file"));
};