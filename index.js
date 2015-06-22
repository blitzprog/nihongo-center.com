"use strict";

let aero = require("aero");
let fs = require("fs");
let os = require("os");
let merge = require("object-assign");
let login = require("./modules/login");
let upload = require("./modules/upload");

let apiKeys = JSON.parse(fs.readFileSync("api-keys.json"));
let production = os.hostname() === "ncenter";
let host = production ? "my.nihongo-center.com" : "localhost:3002";

if(!production)
	console.log("Development Version");

// Google
let googleConfig = merge({
	callbackURL: `http://${host}/auth/google/callback`,
	userInfoURL: "https://www.googleapis.com/plus/v1/people/me"
}, apiKeys.google);

// Facebook
let facebookConfig = merge({
	callbackURL: `http://${host}/auth/facebook/callback`
}, apiKeys.facebook);

// Init login
login(
	aero,
	googleConfig, [
		"email",
		"profile"
	],
	facebookConfig, [
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