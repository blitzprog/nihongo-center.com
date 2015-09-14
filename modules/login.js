"use strict";

let
	passport = require("passport"),
	session = require("express-session"),
	merge = require("object-assign"),
	userData = require("./user-data");

// Database
let riak = require("nodiak").getClient();

// Login providers
let StrategyGoogle = require("passport-google-openidconnect").Strategy;
let FacebookStrategy = require("passport-facebook").Strategy;

// Admins
let adminMails = ["e.urbach@gmail.com"];

module.exports = function(aero, googleConfig, googleScopes, facebookConfig, facebookScopes) {
	aero.events.on("initialized", function() {
		// Accounts
		let userBucket = riak.bucket("Accounts");
		let userDataJSON = JSON.stringify(userData);
		
		passport.use(new StrategyGoogle(
			googleConfig,
			function(iss, sub, profile, accessToken, refreshToken, done) {
				let json = profile._json;
				let email = json.emails[0].value.replace("@googlemail.com", "@gmail.com");
				let accessLevel = "student";
				
				if(adminMails.indexOf(email) !== -1)
					accessLevel = "admin";
				
				// Does the user already exist?
				userBucket.objects.get(email, function(err, obj) {
					if(err) {
						// Create new account
						let account = JSON.parse(userDataJSON);
						
						account = merge(account, {
							email: email,
							accessLevel: accessLevel,
							givenName: json.name.givenName,
							familyName: json.name.familyName,
							gender: json.gender,
							language: json.language,
							birthDay: json.birthday,
							occupation: json.occupation
						});
						
						console.log("New user logged in: " + account.email);
						done(null, account);
						
						return;
					}
					
					// Log in existing account
					done(null, obj.data);
				});
			}
		));
		
		// Facebook login
		passport.use(new FacebookStrategy(
			facebookConfig,
			function(accessToken, refreshToken, profile, done) {
				let json = profile._json;
				let email = json.email.replace("@googlemail.com", "@gmail.com");
				let occupation = (typeof json.work !== "undefined" && json.work.length >= 0) ? json.work[0].position.name : "";
				
				// Does the user already exist?
				userBucket.objects.get(email, function(err, obj) {
					if(err) {
						// Create new account
						let account = JSON.parse(userDataJSON);
						
						account = merge(account, {
							email: email,
							givenName: json.first_name,
							familyName: json.last_name,
							gender: json.gender,
							//birthDay: json.birthday,
							occupation: occupation,
							language: json.locale
						});
						
						console.log("New user logged in: " + account.email);
						done(null, account);
						
						return;
					}
					
					// Log in existing account
					done(null, obj.data);
				});
			}
		));
		
		// Serializer
		passport.serializeUser(function(account, done) {
			let userObject = userBucket.objects.new(account.email, account);
			
			// Save account in database
			userObject.save(function(err) {
				if(err) {
					console.error(err);
					return;
				}
			});
			
			done(null, account.email);
		});
		
		// Deserializer
		passport.deserializeUser(function(email, done) {
			userBucket.objects.get(email, function(err, obj) {
				if(err) {
					console.error(err);
					return;
				}
				
				done(null, obj.data);
			});
		});
		
		// Use a random secret
		aero.app.use(session({
			secret: require("crypto").randomBytes(64).toString("hex"),
			resave: false,
			saveUninitialized: false
		}));
		
		// Use passport sessions
		aero.app.use(passport.initialize());
		aero.app.use(passport.session());
		
		// Apply user language setting to each request/response
		aero.app.use(function(req, res, next) {
			if(req.user && req.user.language) {
				res.setLocale(req.user.language);
			}
			
			next();
		});

		// Redirect the user to Google for authentication.  When complete, Google
		// will redirect the user back to the application at
		//     /auth/google/return
		aero.app.get("/auth/google", passport.authenticate("google-openidconnect", {
			scope: googleScopes
		}));

		// Google will redirect the user to this URL after authentication.  Finish
		// the process by verifying the assertion.  If valid, the user will be
		// logged in.  Otherwise, authentication has failed.
		aero.app.get("/auth/google/callback",
			passport.authenticate("google-openidconnect", {
				failureRedirect: "/"
			}),
			function(req, res) {
				// Successful authentication, redirect home.
				res.redirect("/");
			}
		);
		
		// Redirect the user to Facebook for authentication.  When complete,
		// Facebook will redirect the user back to the application at
		//     /auth/facebook/callback
		aero.app.get("/auth/facebook", passport.authenticate("facebook", {
			scope: facebookScopes
		}));

		// Facebook will redirect the user to this URL after approval.  Finish the
		// authentication process by attempting to obtain an access token.  If
		// access was granted, the user will be logged in.  Otherwise,
		// authentication has failed.
		aero.app.get("/auth/facebook/callback", passport.authenticate("facebook", {
			successRedirect: "/",
			failureRedirect: "/"
		}));
		
		// Logout
		aero.app.get("/logout", function(req, res) {
			req.logout();
			res.redirect("/");
		});
	});
};