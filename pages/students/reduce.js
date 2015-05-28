// Currently not in use

function(valueList) {
	return valueList.filter(function(student) {
		return student !== null;
	}); 
}