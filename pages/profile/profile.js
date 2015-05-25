"use strict";

let S = require("string");
let fs = require("fs");
let saveUserInDB = require("../../modules/save-user");
let age = require("../../modules/age");
let dbArray = require("../../modules/db-array");

// Load file as array
let loadFileAsArray = function(filePath) {
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
		let user = request.user;
		
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		render({
			user: user,
			displayName: user.givenName + " " + user.familyName,
			age: age.of(user),
			nationalities: this.nationalities,
			cities: this.cities,
			countries: this.countries,
			genderOptions: require("./options/gender"),
			maritalStatusOptions: require("./options/maritalStatus"),
			occupationTypeOptions: require("./options/occupationType"),
			startYearOptions: require("./options/startYear"),
			startMonthOptions: require("./options/startMonth"),
			portsOfEntry: require("./options/portsOfEntry"),
			educationOptions: require("./options/education"),
			planAfterGraduationOptions: require("./options/planAfterGraduation"),
			jlptLevels: require("./options/jlptLevels"),
			paymentMethods: require("./options/paymentMethods"),
			courseOptions: [
				{name: "Please choose:", value: "", disabled: true}
			].concat(Object.keys(this.courseToTitle).map(function(courseId) {
				return {
					name: this.courseToTitle[courseId],
					value: courseId
				};
			}.bind(this)))
		});
	},
	
	// Post: Save to database
	post: function(request, render) {
		render(this[request.body.function](request, render));
	},
	
	// Save profile
	saveProfile: function(request, render) {
		let user = request.user;
		let key = request.body.key;
		
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
		
		saveUserInDB(user);
		
		// Render normally
		request.user = user;
		this.get(request, render);
	},
	
	// Save array element
	saveArrayElement: function(request, render) {
		let user = request.user;
		let value = request.body.value;
		let arrayName = request.body.array;
		let index = request.body.index;
		let key = request.body.key;
		
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
			user[arrayName][index][key] = parseInt(value);
		else
			user[arrayName][index][key] = value;
		
		saveUserInDB(user);
		
		// Render normally
		request.user = user;
		this.get(request, render);
	},
	
	// Save object
	saveObject: function(request, render) {
		let user = request.user;
		let value = request.body.value;
		let object = request.body.object;
		let key = request.body.key;
		
		if(request.body.dataType === "numeric")
			user[object][key] = parseInt(value);
		else
			user[object][key] = value;
		
		saveUserInDB(user);
		
		// Render normally
		request.user = user;
		this.get(request, render);
	},
	
	// Add family member
	addFamilyMember: function(request, render) {
		dbArray.add(this, request, render, "familyMembers", {
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
		dbArray.remove(this, request, render, "familyMembers");
	},
	
	// Add education background
	addEducationBackground: function(request, render) {
		dbArray.add(this, request, render, "japaneseEducation", {
			institution: "",
			totalHours: null,
			textBook: ""
		});
	},
	
	// Remove education background
	removeEducationBackground: function(request, render) {
		dbArray.remove(this, request, render, "japaneseEducation");
	},
	
	// Add financial supporter
	addFinancialSupporter: function(request, render) {
		dbArray.add(this, request, render, "financialSupporters", {
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
		dbArray.remove(this, request, render, "financialSupporters");
	}
};