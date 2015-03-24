"use strict";

var passport = require("passport");
var StrategyGoogle = require("passport-google-openidconnect").Strategy;
//var nodiak = require("nodiak");

module.exports = function(aero, googleConfig) {
	aero.events.on("initialized", function() {
		passport.use(new StrategyGoogle(
            googleConfig,
			function(iss, sub, profile, accessToken, refreshToken, done) {
				var user = {
					id: profile.id,
					displayName: profile.displayName
				};
				
				console.log("User logged in: " + user.displayName);
				done(null, user);
			}
		));
		
		// Serializer
		passport.serializeUser(function(user, done) {
			done(null, user);
		});
		
		// Deserializer
		passport.deserializeUser(function(user, done) {
			done(null, user);
		});
		
		aero.app.use(passport.initialize());
		aero.app.use(passport.session());

		// Redirect the user to Google for authentication.  When complete, Google
		// will redirect the user back to the application at
		//     /auth/google/return
		aero.app.get("/auth/google", passport.authenticate("google-openidconnect"));

		// Google will redirect the user to this URL after authentication.  Finish
		// the process by verifying the assertion.  If valid, the user will be
		// logged in.  Otherwise, authentication has failed.
		aero.app.get("/auth/google/callback",
			passport.authenticate("google-openidconnect", {
				failureRedirect: "/login"
			}),
			function(req, res) {
				// Successful authentication, redirect home.
				res.redirect("/");
			}
		);
	});
};