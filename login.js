"use strict";

var passport = require("passport");
var StrategyGoogle = require("passport-google-openidconnect").Strategy;
var riak = require("nodiak").getClient();
var session = require("express-session");

var adminMails = ["e.urbach@gmail.com"];

module.exports = function(aero, googleConfig, scopes) {
	aero.events.on("initialized", function() {
		// Accounts
		var userBucket = riak.bucket("Accounts");
		
		passport.use(new StrategyGoogle(
			googleConfig,
			function(iss, sub, profile, accessToken, refreshToken, done) {
				var json = profile._json;
				var email = json.emails[0].value;
				var accessLevel = "";
				
				if(adminMails.indexOf(email) !== -1)
					accessLevel = "admin";
				
				// Does the user already exist?
				userBucket.objects.get(email, function(err, obj) {
					if(err) {
						// Create new account
						var account = {
							// Personal
							email: email,
							givenName: json.name.givenName,
							familyName: json.name.familyName,
							gender: json.gender,
							language: json.language,
							accessLevel: accessLevel,
							country: "",
							nationality: "",
							maritalStatus: "",
							birthDay: json.birthday,
							birthPlace: "",
							occupation: json.occupation,
							occupationType: "",
							address: "",
							addressAbroad: "",
							telephone: "",
							telephoneAbroad: "",
							
							// Course
							course: "",
							startYear: "",
							startMonth: "",
							
							// Education
							education: "",
							educationalInstitutionName: "",
							graduationDate: "",
							planAfterGraduation: "",
							totalPeriodOfEducation: null,
							
							// Passport
							passportId: "",
							passportDateOfExpiration: "",
							
							// Family
							familyMembers: [],
							relativesAbroad: [],
							
							// Financial
							financialSupporters: [],
							financialSupportPerMonth: {
								self: 0,
								remittanceFromOutside: 0,
								carryingFromAbroad: 0,
								guarantorAbroad: 0,
								scholarship: 0,
								others: 0
							},
							
							// Visa
							portOfEntry: "",
							visaApplicationPlace: "",
							numberOfPastEntries: null,
							lastEntryFrom: "",
							lastEntryTo: "",
							
							// Japanese
							jlptLevel: "",
							japaneseEducation: []
						};
						
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