function(value) {
	var student = JSON.parse(value.values[0].data);
	
	if (student.accessLevel !== "student")
		return [];
	
	return [student];
}