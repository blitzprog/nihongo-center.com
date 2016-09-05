window.addStaffMember = function() {
	let email = $('email')

	$.post('/_/staff', {
		email: email.value
	}).then(response => location.reload())
}