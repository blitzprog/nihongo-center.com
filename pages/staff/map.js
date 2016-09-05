function(value) {
	let staff = JSON.parse(value.values[0].data)
	
	if (staff.accessLevel !== 'admin' && staff.accessLevel !== 'staff')
		return []
	
	return [staff]
}