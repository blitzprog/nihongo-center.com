function addStaffMember() {
	var $email = $("#email");
	var email = $email.val();
	
	$.post("/raw/staff", {
		email: email
	}, function(response) {
		location.reload();
	});
};