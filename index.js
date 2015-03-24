"use strict";

var aero = require("aero");
var login = require("./login");

// Setup login
login(aero, {
	clientID: "142269503991-oj65drmhdreneseg4v9j25l4t4lvocrr.apps.googleusercontent.com",
	clientSecret: "QgM9AITTtrTRPA_Wb8MCVZWR",	// Well this shouldn't be on git...
	callbackURL: "http://localhost:3002/auth/google/callback"
});

// Start Aero
aero.start();