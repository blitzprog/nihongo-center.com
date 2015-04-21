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
	countries: loadFileAsArray("pages/profile/autocomplete/countries.txt"),
	courseToTitle: JSON.parse(fs.readFileSync("data/courses.json", "utf8")),
	
	// Get
	get: function(request, render) {
		var user = request.user;
		
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		var currentYear = new Date().getFullYear();
		
		render({
			user: user,
			displayName: user.givenName + " " + user.familyName,
			age: this.getAge(new Date(user.birthDay)),
			nationalities: this.nationalities,
			cities: this.cities,
			countries: this.countries,
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
			portsOfEntry: [
				{name: "Please choose:", value: "", disabled: true},
				{name: "Osaka (Kansai International Airport)", value: "Kansai International Airport"},
				{name: "Tokyo (Narita International Airport)", value: "Narita International Airport"},
				{name: "Other", value: "other"}
			],
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
				{name: "Work in Japan", value: "work"},
				{name: "Other educational institution", value: "otherEducationalInstitution"},
				{name: "Other", value: "other"}
			],
			jlptLevels: [
				{name: "Please choose:", value: "", disabled: true},
				{name: "I have not taken the JLPT yet.", value: "none"},
				{name: "N1", value: "N1"},
				{name: "N2", value: "N2"},
				{name: "N3", value: "N3"},
				{name: "N4", value: "N4"},
				{name: "N5", value: "N5"},
				{name: "Level 1 (before 2010)", value: "level 1"},
				{name: "Level 2 (before 2010)", value: "level 2"},
				{name: "Level 3 (before 2010)", value: "level 3"},
				{name: "Level 4 (before 2010)", value: "level 4"}
			]
		});
	},
	
	// Get age
	getAge: function(d1, d2) {
		d2 = d2 || new Date();
		var diff = d2.getTime() - d1.getTime();
		return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
	},
	
	// Post: Save to database
	post: function(request, render) {
		render(this[request.body.function](request, render));
	},
	
	// Save profile
	saveProfile: function(request, render) {
		var user = request.user;
		var key = request.body.key;
		
		if(request.body.dataType === "numeric")
			user[key] = parseInt(request.body.value);
		else
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
		this.get(request, render);
	},
	
	// Save array element
	saveArrayElement: function(request, render) {
		var user = request.user;
		var value = request.body.value;
		var array = request.body.array;
		var index = request.body.index;
		var key = request.body.key;
		
		// Trim
		value = value.trim();
		
		// Capitalize all parts
		if(["name", "occupation"].indexOf(key) !== -1) {
			value = value.split(" ").map(function(part) {
				return S(part).capitalize().s;
			}).join(" ");
		}
		
		// Capitalize beginning only
		if(["relation", "nationality"].indexOf(key) !== -1)
			value = S(value).capitalize().s;
		
		if(request.body.dataType === "numeric")
			user[array][index][key] = parseInt(value);
		else
			user[array][index][key] = value;
		
		this.saveUserInDB(user);
		
		// Render normally
		request.user = user;
		this.get(request, render);
	},
	
	// Save object
	saveObject: function(request, render) {
		var user = request.user;
		var value = request.body.value;
		var object = request.body.object;
		var key = request.body.key;
		
		if(request.body.dataType === "numeric")
			user[object][key] = parseInt(value);
		else
			user[object][key] = value;
		
		this.saveUserInDB(user);
		
		// Render normally
		request.user = user;
		this.get(request, render);
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
		});
	},
	
	// Add (generic)
	add: function(request, render, key, obj) {
		request.user[key].push(obj);
		this.saveUserInDB(request.user);
		this.get(request, render);
	},
	
	// Remove (generic)
	remove: function(request, render, key) {
		request.user[key].splice(request.body.index, 1);
		this.saveUserInDB(request.user);
		this.get(request, render);
	},
	
	// Add family member
	addFamilyMember: function(request, render) {
		this.add(request, render, "familyMembers", {
			name: "",
			relation: "",
			age: "",
			occupation: "",
			nationality: "",
			country: ""
		});
	},
	
	// Remove family member
	removeFamilyMember: function(request, render) {
		this.remove(request, render, "familyMembers");
	},
	
	// Add education background
	addEducationBackground: function(request, render) {
		this.add(request, render, "japaneseEducation", {
			institution: "",
			totalHours: null,
			textBook: ""
		});
	},
	
	// Remove education background
	removeEducationBackground: function(request, render) {
		this.remove(request, render, "japaneseEducation");
	},
	
	// Add financial supporter
	addFinancialSupporter: function(request, render) {
		this.add(request, render, "financialSupporters", {
			name: "",
			address: "",
			telephone: "",
			occupation: "",
			company: "",
			companyTelephone: "",
			annualIncome: null,
			relation: ""
		});
	},
	
	// Remove financial supporter
	removeFinancialSupporter: function(request, render) {
		this.remove(request, render, "financialSupporters");
	}
};