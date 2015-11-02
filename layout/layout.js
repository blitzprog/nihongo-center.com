"use strict";

module.exports = {
	render: function(request, render) {
		let user = request.user;
		let pages = {
			"dashboard": {
				id: "dashboard",
				url: "",
				icon: "dashboard"
			},
			"profile": {
				id: "profile",
				url: "profile",
				icon: "user"
			},
			"uploads": {
				id: "uploads",
				url: "uploads",
				icon: "upload"
			},
			"stages": {
				id: "stages",
				url: "stages",
				icon: "list"
			},
			"login": {
				id: "login",
				url: "login",
				icon: "home"
			},
			"students": {
				id: "students",
				url: "students",
				icon: "book"
			},
			"courses": {
				id: "courses",
				url: "courses",
				icon: "blackboard"
			},
			"staff": {
				id: "staff",
				url: "staff",
				icon: "flash"
			},
			"settings": {
				id: "settings",
				url: "settings",
				icon: "cog"
			}
		}

		let loggedInPages = null;

		if(user && (user.accessLevel === "admin" || user.accessLevel === "staff")) {
			loggedInPages = [
				"dashboard",
				"students",
				"courses",
				"staff",
				"settings"
			].map(id => pages[id])
		} else {
			loggedInPages = [
				"dashboard",
				"profile",
				"uploads",
				"stages",
				"settings"
			].map(id => pages[id])
		}

		render({
			user,
			loggedInPages
		});
	}
};
