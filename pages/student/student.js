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
			
			let student = obj.data;
			student.age = age.of(student);
			
			// Create an inverted dictionary based on fileTypes
			let humanized = Object.keys(student).reduce(function(dict, key) {
				if(key)
					dict[key] = S(key).humanize().s;
				
				return dict;
			}, {});
			
			render({
				host: "http://localhost:8098",
				student: student,
				humanized: humanized,
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
					"uploads"
				],
				renderKey: {
					"uploads": student.uploads.map(function(upload) {
						return "<div>" + S(upload.purpose).humanize().s + ": <a href='/" + upload.path + "'>" + upload.originalname + "</a></div>";
					}).reduce(function(a, b) {
						return a + b;
					}),
					// TODO: Improve
					"familyMembers": student.familyMembers.map(function(member) {
						return member.name;
					})
				}
			});
		});
	}
};