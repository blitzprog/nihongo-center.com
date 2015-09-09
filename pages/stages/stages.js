"use strict";

module.exports = {
	stageList: JSON.parse(require("fs").readFileSync("data/stage-list.json")),
	
	// Get
	get: function(request, render) {
		let user = request.user;
		
		// Render the page
		render({
			user: user,
			stageList: this.stageList
		});
	}
};