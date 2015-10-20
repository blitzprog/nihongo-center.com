"use strict";

let S = require("string");
let fs = require("fs");
let saveUserInDB = require("../../modules/save-user");
let age = require("../../modules/age");
let dbArray = require("../../modules/db-array");
let sumOfValues = require("../../modules/sumOfValues");

let americaSynonyms = ["America", "U.S.A", "U.S.A.", "USA"];

// Load file as array
let loadFileAsArray = function(filePath) {
	return fs.readFileSync(filePath, "utf8").toString().split("\n");
};

module.exports = {
	// List of nationalities
	nationalities: loadFileAsArray("data/nationalities.txt"),
	cities: loadFileAsArray("data/cities.txt"),
	countries: loadFileAsArray("data/countries.txt"),
	
	// Get
	get: function(request, render) {
		let user = request.user;
		let __ = request.__;
		
		if(typeof user === "undefined") {
			render();
			return;
		}
		
		user.financialSupportPerMonth.total = sumOfValues(user.financialSupportPerMonth);
		
		let selection = function(options) {
			let choose = {};
			choose[""] = __("pleaseChoose");
			return Object.assign(choose, options);
		};
		
		render({
			user: user,
			displayName: user.givenName + " " + user.familyName,
			age: age.of(user),
			nationalities: this.nationalities,
			cities: this.cities,
			countries: this.countries,
			genderOptions: selection(__("options.gender")),
			maritalStatusOptions: selection(__("options.maritalStatus")),
			occupationTypeOptions: selection(__("options.occupationType")),
			startYearOptions: selection(require("./options/startYear")),
			startMonthOptions: selection(require("./options/startMonth")(__)),
			portsOfEntry: selection(__("options.portOfEntry")),
			educationOptions: selection(__("options.education")),
			planAfterGraduationOptions: selection(__("options.planAfterGraduation")),
			jlptLevels: selection(__("options.jlptLevel")),
			paymentMethods: selection(__("options.paymentMethod")),
			courseOptions: [
				{name: "Please choose:", value: "", disabled: true}
			].concat(Object.keys(__("options.course")).map(function(courseId) {
				return {
					name: __("options.course." + courseId.replace(".", ",")),
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
		
		// Country
		user.country = user.country.trim();
		
		if(americaSynonyms.indexOf(user.country) !== -1)
			user.country = "United States";
		
		//user.applicationDate = null;
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