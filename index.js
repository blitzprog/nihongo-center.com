'use strict'

var app = null

require('strict-mode')(function () {
	app = require("aero")()
})

let fs = require("fs")
let os = require("os")
let merge = require("object-assign")
let login = require("./modules/login")
let upload = require("./modules/upload")
let availableLanguages = require("./modules/languages")
let i18n = require("i18n")

let apiKeys = require("./api-keys.json")
let production = os.hostname() === "ncenter"
let host = production ? "my.nihongo-center.com" : "localhost:3003"

if(!production)
	console.log("Development Version")

// Translations
i18n.configure({
	locales: availableLanguages,
	defaultLocale: "en",
	directory: "locales",
	objectNotation: true
})

// Translation
app.use(i18n.init)

// Google
let googleConfig = merge({
	callbackURL: `https://${host}/auth/google/callback`,
	passReqToCallback: true
}, apiKeys.google)

// Facebook
let facebookConfig = merge({
	callbackURL: `https://${host}/auth/facebook/callback`,
	passReqToCallback: true
}, apiKeys.facebook)

// Init login
login(
	app,
	googleConfig, [
		"https://www.googleapis.com/auth/plus.login",
	    "email"
	],
	facebookConfig, [
		"email",
		"public_profile",
		//"user_birthday",
		"user_work_history"
	]
)

// Init uploads
upload(app)

// Translation functions
app.use(function(request, response, next) {
	request.globals = {
		__: request.__
	}
	next()
})

app.use(require('body-parser').json())

// Start Aero
app.run()