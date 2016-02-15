window.addStaffMember = function() {
	var email = $("email");

	$.post("/_/staff", {
		email: email.value
	}).then(function(response) {
		location.reload();
	});
};