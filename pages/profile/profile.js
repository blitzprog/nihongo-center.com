"use strict";

let S = require("string");
let fs = require("fs");
let saveUserInDB = require("../../modules/save-user");
let age = require("../../modules/age");
let dbArray = require("../../modules/db-array");
let sumOfValues = require("../../modules/sumOfValues");
let getCountry = require("../../modules/getCountry");
let fetch = require('request-promise');

let americaSynonyms = ["America", "U.S.A", "U.S.A.", "USA", "United States of America"];

// Load file as array
let loadFileAsArray = function(filePath) {
	return fs.readFileSync(filePath, "utf8").toString().split("\n");
};

let sendToSlack = function(url, message) {
	let data = {
		text: message
	}

	return fetch({
		method: 'POST',
		uri: url,
		body: data,
		json: true
	})
};

module.exports = {
	init: function() {
		this.nationalities = loadFileAsArray("data/nationalities.txt")
		this.cities = loadFileAsArray("data/cities.txt")
		this.countries = loadFileAsArray("data/countries.txt")

		console.log("Loaded nationalities:", this.nationalities.length)
		console.log("Loaded cities:", this.cities.length)
		console.log("Loaded countries:", this.countries.length)
	},

	// Get
	get: function(request, response) {
		let user = request.user;
		let __ = request.__;

		if(typeof user === "undefined") {
			response.render();
			return;
		}

		user.financialSupportPerMonth.total = sumOfValues(user.financialSupportPerMonth);
		let country = getCountry(user.country);

		let selection = function(options) {
			let choose = {};
			choose[""] = __("pleaseChoose");
			return Object.assign(choose, options);
		};

		let courseOptions = __("options.course")

		if(country && !country.visaEasy) {
			// This way of copying will preserve the order, unlike Object.assign
			let copy = {}
			let keys = Object.keys(courseOptions).filter(course => course != "10 weeks")
			keys.forEach(key => copy[key] = courseOptions[key])
			courseOptions = copy
		}

		response.render({
			user: user,
			displayName: user.givenName + " " + user.familyName,
			age: age.of(user),
			nationalities: this.nationalities,
			cities: this.cities,
			countries: this.countries,
			country: country,
			genderOptions: selection(__("options.gender")),
			maritalStatusOptions: selection(__("options.maritalStatus")),
			occupationTypeOptions: selection(__("options.occupationType")),
			startYearOptions: selection(require("./options/startYear")()),
			startMonthOptions: selection(require("./options/startMonth")(__, user.startYear)),
			portsOfEntry: selection(__("options.portOfEntry")),
			educationOptions: selection(__("options.education")),
			planAfterGraduationOptions: selection(__("options.planAfterGraduation")),
			jlptLevels: selection(__("options.jlptLevel")),
			paymentMethods: selection(__("options.paymentMethod")),
			courseOptions: selection(courseOptions)
		});
	},

	// Post: Save to database
	post: function(request, response) {
		if(!request.body.function) {
			response.writeHead(400)
			response.end();
			return
		}

		this[request.body.function](request, response);
	},

	// Save profile
	saveProfile: function(request, response) {
		let user = request.user;
		let key = request.body.key;
		let old = user[key];

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
		this.get(request, response);

		// Slack message
		let userLink = `<https://my.nihongo-center.com/student/${user.email}|${user.givenName} ${user.familyName}>`
		let message = old ?
			`${userLink} changed _${key}_ from *${old}* to *${user[key]}*` :
			`${userLink} added _${key}_: *${user[key]}*`;

		sendToSlack(
			'https://hooks.slack.com/services/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',
			message
		);
	},

	// Save array element
	saveArrayElement: function(request, response) {
		let user = request.user;
		let value = request.body.value;
		let arrayName = request.body.array;
		let index = request.body.index;
		let key = request.body.key;

		if(request.body.dataType === "numeric") {
			user[arrayName][index][key] = parseInt(value);
		} else {
			// Trim
			value = value.trim();

			// Capitalize beginning only
			if(["relation", "nationality"].indexOf(key) !== -1)
				value = S(value).capitalize().s;

			// Capitalize all parts
			if(["name", "occupation"].indexOf(key) !== -1) {
				value = value.split(" ").map(function(part) {
					return S(part).capitalize().s;
				}).join(" ");
			}

			user[arrayName][index][key] = value;
		}

		saveUserInDB(user);

		// Render normally
		request.user = user;
		this.get(request, response);
	},

	// Save object
	saveObject: function(request, response) {
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
		this.get(request, response);
	},

	// Add family member
	addFamilyMember: function(request, response) {
		dbArray.add(this, request, response, "familyMembers", {
			name: "",
			relation: "",
			age: "",
			occupation: "",
			nationality: "",
			country: ""
		});
	},

	// Remove family member
	removeFamilyMember: function(request, response) {
		dbArray.remove(this, request, response, "familyMembers");
	},

	// Add education background
	addEducationBackground: function(request, response) {
		dbArray.add(this, request, response, "japaneseEducation", {
			institution: "",
			totalHours: null,
			textBook: ""
		});
	},

	// Remove education background
	removeEducationBackground: function(request, response) {
		dbArray.remove(this, request, response, "japaneseEducation");
	},

	// Add financial supporter
	addFinancialSupporter: function(request, response) {
		dbArray.add(this, request, response, "financialSupporters", {
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
	removeFinancialSupporter: function(request, response) {
		dbArray.remove(this, request, response, "financialSupporters");
	}
};
