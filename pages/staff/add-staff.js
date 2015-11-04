function addStaffMember() {
	var $email = $("#email");
	var email = $email.val();

	$.post("/_/staff", {
		email: email
	}, function(response) {
		location.reload();
	});
};