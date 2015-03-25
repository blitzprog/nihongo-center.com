"use strict";

var passport = require("passport");
var StrategyGoogle = require("passport-google-openidconnect").Strategy;
var riak = require("nodiak").getClient();
var session = require("express-session");

module.exports = function(aero, googleConfig, scopes) {
	aero.events.on("initialized", function() {
		passport.use(new StrategyGoogle(
			googleConfig,
			function(iss, sub, profile, accessToken, refreshToken, done) {
				var json = profile._json;
				
				var account = {
					email: json.emails[0].value,
					name: json.name,
					gender: json.gender,
					birthday: json.birthday,
					occupation: json.occupation,
					language: json.language
				};
				
				console.log("User logged in: " + account.email);
				done(null, account);
			}
		));
		
		// Serializer
		passport.serializeUser(function(account, done) {
			var userBucket = riak.bucket("Accounts");
			var userObject = userBucket.objects.new(account.email, account);
			
			// Save account in database
			userObject.save(function(err, obj) {
				if(err) {
					console.error(err);
					return;
				}
				
				console.log("Saved " + obj.data.email + " to database");
			});
			
			done(null, account.email);
		});
		
		// Deserializer
		passport.deserializeUser(function(email, done) {
			console.log("Deserialize: " + email);
            
			var userBucket = riak.bucket("Accounts");
			userBucket.objects.get(email, function(err, obj) {
				if(err) {
					console.error(err);
					return;
				}
				
				var account = obj.data;
				
				console.log(account);
				done(null, account);
			});
		});
		
		// Use a random secret
		aero.app.use(session({
			secret: require("crypto").randomBytes(64).toString("hex"),
			resave: false,
			saveUninitialized: false
		}));
		
		aero.app.use(passport.initialize());
		aero.app.use(passport.session());

		// Redirect the user to Google for authentication.  When complete, Google
		// will redirect the user back to the application at
		//     /auth/google/return
		aero.app.get("/auth/google", passport.authenticate("google-openidconnect", {
			scope: scopes
		}));

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