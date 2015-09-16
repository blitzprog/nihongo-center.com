"use strict";

let fs = require("fs");
let S = require("string");
let age = require("../../modules/age");
let riak = require("nodiak").getClient();

// Country data
let countryData = require("country-data");
let lookup = countryData.lookup;
let currencies = countryData.currencies;
let languages = countryData.languages;

// Load file as array
let loadFileAsArray = function(filePath) {
	return fs.readFileSync(filePath, "utf8").toString().split("\n");
};

let visaEasy = loadFileAsArray("data/visa-easy-countries.txt").reduce(function(dict, value) {
	dict[value] = null;
	return dict;
}, {});

module.exports = {
	get: function(request, render) {
		var email = request.params.email;
		
		riak.bucket("Accounts").objects.get(email, function(err, obj) {
			if(err) {
				render();
				return;
			}
			
			var monthNames = [
				"January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"
			];
			
			let student = obj.data;
			student.age = age.of(student);
			student.displayName = student.givenName + " " + student.familyName;
			student.heShe = student.gender === "male" ? "He" : "She";
			student.hisHer = student.gender === "male" ? "his" : "her";
			student.heSheJp = student.gender === "male" ? "彼" : "彼女";
			student.startMonthName = monthNames[student.startMonth - 1];
			
			// Create an inverted dictionary based on fileTypes
			let humanized = Object.keys(student).reduce(function(dict, key) {
				if(key)
					dict[key] = S(key).humanize().s;
				
				return dict;
			}, {});
			
			let description = `${student.givenName} is ${student.age} years old and ${student.maritalStatus}. `;
			description += `${student.heShe} is from ${student.country} and wants to start a ${student.course} course in ${student.startMonthName} ${student.startYear}. `;
			
			if(student.familyMembers.length === 0)
				description += `${student.heShe} has no family members.`;
			else if(student.familyMembers.length === 1)
				description += `${S(student.hisHer).capitalize().s} only family member is ${student.familyMembers[0].name}.`;
			else
				description += `There are ${student.familyMembers.length} people in ${student.hisHer} family.`;
			
			//let japaneseDescription = `${student.givenName}は${student.age}歳です. `;
			//japaneseDescription += `${student.heSheJp}は${student.country}住んでいて、${student.startYear}年${student.startMonth}月の${student.course}コースに入りたいです。`;
			
			for(let key of ["heShe", "heSheJp", "hisHer", "startMonthName"]) {
				delete student[key];
			}
			
			let country = null;
			
			if(student.country) {
				country = lookup.countries({name: student.country})[0];
				
				if(country) {
					country.currencies = country.currencies.map(function(currencyCode) {
						let currency = currencies[currencyCode];
						
						if(currency)
							return `${currency.name} (${currencyCode})`;
						
						return currencyCode;
					});
					
					country.languages = country.languages.map(function(languageCode) {
						let language = languages[languageCode];
						
						if(language)
							return language.name;
						
						return languageCode;
					});
					
					country.visaEasy = visaEasy[country.name] !== undefined;
				}
			}
			
			let uploadsHTML = "<div class='alert alert-danger'>The student did not upload any files yet!</div>";
			
			if(student.uploads.length > 0) {
				uploadsHTML = "<ul class='list-group'>" + student.uploads.map(function(upload) {
					return "<li class='list-group-item'><a href='/" + upload.path + "'>" + S(upload.purpose).humanize().s + "</a></li>";
				}).reduce(function(a, b) {
					return a + b;
				}, "") + "</ul>";
			}
			
			render({
				user: request.user,
				country,
				student,
				humanized,
				description,
				//japaneseDescription,
				/*prioritizedKeys: [
					"email",
					"givenName",
					"familyName",
					"age",
					"gender",
					"country",
					"nationality",
					"course",
					"startYear",
					"startMonth",
					"uploads",
					"stage"
				],*/
				renderKey: {
					"uploads": uploadsHTML,
					// TODO: Improve
					"familyMembers": student.familyMembers.map(function(member) {
						return "<div>" + JSON.stringify(member, null, "<br>") + "</div>";
					}),
					"financialSupporters": student.financialSupporters.map(function(supporter) {
						return "<div>" + JSON.stringify(supporter, null, "<br>") + "</div>";
					}),
					"japaneseEducation": student.japaneseEducation.map(function(education) {
						return "<div>" + JSON.stringify(education, null, "<br>") + "</div>";
					}),
					"financialSupportPerMonth": JSON.stringify(student.financialSupportPerMonth, null, "<br>"),
					"stage": student.stage
				}
			});
		});
	}
};