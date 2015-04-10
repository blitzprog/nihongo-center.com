"use strict";

var S = require("string");
var fs = require("fs");

// Load file as array
var loadFileAsArray = function(filePath) {
	return fs.readFileSync(filePath, "utf8").toString().split("\n");
};

module.exports = {
	// List of nationalities
	nationalities: loadFileAsArray("pages/profile/autocomplete/nationalities.txt"),
	cities: loadFileAsArray("pages/profile/autocomplete/cities.txt"),
	courseToTitle: JSON.parse(fs.readFileSync("data/courses.json", "utf8")),
	
	// Get
	get: function(request) {
		var user = request.user;
		
		if(typeof user === "undefined")
			return undefined;
		
		var currentYear = new Date().getFullYear();
		
		return {
			user: user,
			displayName: user.givenName + " " + user.familyName,
			age: this.getAge(new Date(user.birthDay)),
			nationalities: this.nationalities,
			cities: this.cities,
			genderOptions: [
				{name: "Please choose:", value: "", disabled: true},
				{name: "♂ Male", value: "male"},
				{name: "♀ Female", value: "female"}
			],
			maritalStatusOptions: [
				{name: "Please choose:", value: "", disabled: true},
				{name: "Single", value: "single"},
				{name: "Married", value: "married"}
			],
			occupationTypeOptions: [
				{name: "Please choose:", value: "", disabled: true},
				{name: "Student", value: "student"},
				{name: "Worker", value: "worker"},
				{name: "Preparing to study in Japan", value: "preparingToStudy"},
				{name: "Other", value: "other"}
			],
			startYearOptions: [
				{name: currentYear, value: currentYear.toString()},
				{name: currentYear + 1, value: (currentYear + 1).toString()}
			],
			startMonthOptions: [
				{name: "Please choose:", value: "", disabled: true},
				{name: "April", value: "04"},
				{name: "June", value: "06"},
				{name: "October", value: "10"},
				{name: "January", value: "01"}
			],
			courseOptions: [
				{name: "Please choose:", value: "", disabled: true}
			].concat(Object.keys(this.courseToTitle).map(function(courseId) {
				return {
					name: this.courseToTitle[courseId],
					value: courseId
				};
			}.bind(this))),
			educationOptions: [
				{name: "Please choose:", value: "", disabled: true},
				{name: "Graduated", value: "graduated"},
				{name: "In school", value: "inSchool"},
				{name: "Temporary absence", value: "temporaryAbsence"},
				{name: "Withdrew from school", value: "withdrewFromSchool"},
				{name: "Doctor", value: "doctor"},
				{name: "Master", value: "master"},
				{name: "Bachelor", value: "bachelor"},
				{name: "Junior college", value: "juniorCollege"},
				{name: "College of technology", value: "collegeOfTechnology"},
				{name: "Senior high school", value: "seniorHighSchool"},
				{name: "Junior high school", value: "juniorHighSchool"},
				{name: "Other", value: "other"}
			],
			planAfterGraduationOptions: [
				{name: "Please choose:", value: "", disabled: true},
				{name: "Return to home country", value: "returnToHomeCountry"},
				{name: "Graduate school", value: "graduateSchool"},
				{name: "University", value: "university"},
				{name: "Junior college", value: "juniorCollege"},
				{name: "College of technology", value: "collegeOfTechnology"},
				{name: "Other educational institution", value: "otherEducationalInstitution"},
				{name: "Other", value: "other"}
			]
		};
	},
	
	// Get age
	getAge: function(d1, d2) {
		d2 = d2 || new Date();
		var diff = d2.getTime() - d1.getTime();
		return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
	},
	
	// Post: Save to database
	post: function(request) {
		return this[request.body.function](request);
	},
	
	// Save profile
	saveProfile: function(request) {
		var user = request.user;
		var key = request.body.key;
		
		user[key] = request.body.value;
		
		// Capitalize
		[
			"givenName",
			"familyName",
			"nationality",
			"birthPlace"
		].forEach(function(field) {
			if(user[field])
				user[field] = S(user[field]).capitalize().s;
		});
		
		this.saveUserInDB(user);
		
		// Render normally
		request.user = user;
		return this.get(request);
	},
	
	// Save array element
	saveArrayElement: function(request) {
		var user = request.user;
		var value = request.body.value;
		var array = request.body.array;
		var index = request.body.index;
		var key = request.body.key;
		
		// Trim
		value = value.trim();
		
		// Capitalize all parts
		if(["name"].indexOf(key) !== -1) {
			value = value.split(" ").map(function(part) {
				return S(part).capitalize().s;
			}).join(" ");
		}
		
		// Capitalize beginning only
		if(["relation", "occupation", "nationality", "country"].indexOf(key) !== -1)
			value = S(value).capitalize().s;
		
		user[array][index][key] = value;
		
		this.saveUserInDB(user);
		
		// Render normally
		request.user = user;
		return this.get(request);
	},
	
	// Save user in database
	saveUserInDB: function(user, callBack) {
		// Connect
		var riak = require("nodiak").getClient();
		var userBucket = riak.bucket("Accounts");
		var userObject = userBucket.objects.new(user.email, user);
		
		// Save account in database
		userObject.save(function(err, obj) {
			if(err) {
				console.error(err);
				return;
			}
			
			if(callBack)
				callBack(obj);
			
			console.log("Saved " + obj.data.email + " to database");
		});
	},
	
	// Add family member
	addFamilyMember: function(request) {
		request.user.familyMembers.push({
			name: "",
			relation: "",
			age: "",
			occupation: "",
			nationality: "",
			country: ""
		});
		
		this.saveUserInDB(request.user);
		
		// Render normally
		return this.get(request);
	},
	
	// Remove family member
	removeFamilyMember: function(request) {
		request.user.familyMembers.splice(request.body.index, 1);
		
		this.saveUserInDB(request.user);
		
		// Render normally
		return this.get(request);
	}
};