"use strict";

let aero = require("aero");
let fs = require("fs");
let os = require("os");
let merge = require("object-assign");
let login = require("./modules/login");
let upload = require("./modules/upload");
let availableLanguages = require("./modules/languages");
let i18n = require("i18n");

let apiKeys = JSON.parse(fs.readFileSync("api-keys.json"));
let production = os.hostname() === "ncenter";
let host = production ? "my.nihongo-center.com" : "localhost:3003";

if(!production)
	console.log("Development Version");

// Translations
i18n.configure({
	locales: availableLanguages,
	defaultLocale: "en",
	directory: "locales",
	objectNotation: true
});

// Translation
aero.use(i18n.init);

// Google
let googleConfig = merge({
	callbackURL: `https://${host}/auth/google/callback`,
	userInfoURL: "https://www.googleapis.com/plus/v1/people/me"
}, apiKeys.google);

// Facebook
let facebookConfig = merge({
	callbackURL: `https://${host}/auth/facebook/callback`
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

// Translation functions
aero.use(function(request, response, next) {
	request.globals = {
		__: request.__
	}
	next()
})

aero.use(require('body-parser').urlencoded({
	extended: false
}))

// Start Aero
aero.run();