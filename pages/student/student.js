"use strict";

let riak = require("nodiak").getClient();
let age = require("../../modules/age");
let S = require("string");

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
			student.heSheJp = student.gender === "male" ? "彼" : "彼女";
			student.startMonthName = monthNames[student.startMonth - 1];
			
			// Create an inverted dictionary based on fileTypes
			let humanized = Object.keys(student).reduce(function(dict, key) {
				if(key)
					dict[key] = S(key).humanize().s;
				
				return dict;
			}, {});
			
			let description = `<b>${student.givenName}</b> is <b>${student.age}</b> years old. `;
			description += `<b>${student.heShe}</b> is from <b>${student.country}</b> and wants to start a <b>${student.course}</b> course in <b>${student.startMonthName} ${student.startYear}</b>.`;
			
			let japaneseDescription = `${student.givenName}は${student.age}歳です. `;
			japaneseDescription += `${student.heSheJp}は${student.country}に住んでいて、${student.startMonth}月${student.startYear}年${student.course}コースに入りたいです。`;
			
			render({
				host: "http://localhost:8098",
				user: request.user,
				student: student,
				humanized: humanized,
				description: description,
				japaneseDescription: japaneseDescription,
				prioritizedKeys: [
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
				],
				renderKey: {
					"uploads": student.uploads.map(function(upload) {
						return "<div>" + S(upload.purpose).humanize().s + ": <a href='/" + upload.path + "'>" + upload.originalname + "</a></div>";
					}).reduce(function(a, b) {
						return a + b;
					}),
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