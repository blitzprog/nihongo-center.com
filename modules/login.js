"use strict";

let
	passport = require("passport"),
	session = require("express-session"),
	merge = require("object-assign"),
	userData = require("./user-data"),
	availableLanguages = require("./languages"),
	request = require("request");

// Database
let riak = require("nodiak").getClient();

// Login providers
let StrategyGoogle = require("passport-google-openidconnect").Strategy;
let FacebookStrategy = require("passport-facebook").Strategy;

// Admins
let adminMails = ["e.urbach@gmail.com"];

let sendRegistrationMessageToSlack = function(student) {
	let host = "http://my.nihongo-center.com";
	let webhook = "https://hooks.slack.com/services/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";

	request.post({
		url: webhook,
		body: JSON.stringify({
			text: "<" + host + "/student/" + student.email + "|" + student.givenName + " " + student.familyName + ">"
		}), function(err, res, body) {
			if(err)
				console.error(err)
			else
				console.log('Sent slack message.')
		}
	});
};

module.exports = function(aero, googleConfig, googleScopes, facebookConfig, facebookScopes) {
	aero.on("server started", function() {
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

						// Log
						console.log("New user logged in: " + account.email);

						// Send slack message
						sendRegistrationMessageToSlack(account);

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

						// Log
						console.log("New user logged in: " + account.email);

						// Send slack message
						sendRegistrationMessageToSlack(account);

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

				// TEST
				//obj.data.accessLevel = "admin";

				done(null, obj.data);
			});
		});

		// Use a random secret
		aero.use(session({
			secret: require("crypto").randomBytes(64).toString("hex"),
			resave: false,
			saveUninitialized: false
		}));

		// Use passport sessions
		aero.use(passport.initialize());
		aero.use(passport.session());

		// Apply user language setting to each request/response
		aero.use(function(req, res, next) {
			if(req.user && req.user.language) {
				req.user.language = req.user.language.substring(0, 2);
				if(availableLanguages.indexOf(req.user.language) !== -1) {
					req.locale = req.user.language;
					req.setLocale(req.user.language);
				}
			}

			next();
		});

		// Redirect the user to Google for authentication.  When complete, Google
		// will redirect the user back to the application at
		//     /auth/google/return
		aero.get("/auth/google", passport.authenticate("google-openidconnect", {
			scope: googleScopes
		}));

		// Google will redirect the user to this URL after authentication.  Finish
		// the process by verifying the assertion.  If valid, the user will be
		// logged in.  Otherwise, authentication has failed.
		aero.get("/auth/google/callback",
			passport.authenticate("google-openidconnect", {
				successRedirect: "/",
				failureRedirect: "/"
			})
		);

		// Redirect the user to Facebook for authentication.  When complete,
		// Facebook will redirect the user back to the application at
		//     /auth/facebook/callback
		aero.get("/auth/facebook", passport.authenticate("facebook", {
			scope: facebookScopes
		}));

		// Facebook will redirect the user to this URL after approval.  Finish the
		// authentication process by attempting to obtain an access token.  If
		// access was granted, the user will be logged in.  Otherwise,
		// authentication has failed.
		aero.get("/auth/facebook/callback", passport.authenticate("facebook", {
			successRedirect: "/",
			failureRedirect: "/"
		}));

		// Logout
		aero.get("/logout", function(req, res) {
			req.logout();
			res.redirect("/");
		});
	});
};
