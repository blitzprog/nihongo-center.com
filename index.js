"use strict";

let aero = require("aero");
let fs = require("fs");
let merge = require("object-assign");
let login = require("./modules/login");
let upload = require("./modules/upload");

let loginConfig = JSON.parse(fs.readFileSync("login-config.json"));

// Google
let googleConfig = merge({
	callbackURL: "http://localhost:3002/auth/google/callback",
	userInfoURL: "https://www.googleapis.com/plus/v1/people/me"
}, loginConfig.google);

// Facebook
let facebookConfig = merge({
	callbackURL: "http://localhost:3002/auth/facebook/callback"
}, loginConfig.facebook);

// Init login
login(
	aero,
	googleConfig,
	[
		"email",
		"profile"
	],
	facebookConfig,
	[
		"email",
		"public_profile",
		//"user_birthday",
		"user_work_history"
	]
);

// Init uploads
upload(aero);

// Start Aero
aero.start();