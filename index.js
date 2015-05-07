"use strict";

let aero = require("aero");
let login = require("./modules/login");
let upload = require("./modules/upload");

// Init login
login(aero, {
	clientID: "142269503991-oj65drmhdreneseg4v9j25l4t4lvocrr.apps.googleusercontent.com",
	clientSecret: "QgM9AITTtrTRPA_Wb8MCVZWR",	// Well this shouldn't be on git...
	callbackURL: "http://localhost:3002/auth/google/callback",
	userInfoURL: "https://www.googleapis.com/plus/v1/people/me"
}, [
	"email",
	"profile"
]);

// Init uploads
upload(aero);

// Start Aero
aero.start();