function(value) {
	var user = JSON.parse(value.values[0].data);

	if(user.accessLevel !== "student")
		return [];

	return [user];
}