"use strict";

module.exports = {
	stageList: JSON.parse(require("fs").readFileSync("pages/stages/stage-list.json")),
	
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