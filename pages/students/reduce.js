// Currently not in use

function(valueList) {
	valueList = valueList.filter(function(student) {
		return student !== null;
	});
	valueList.sort(function(a, b) {
		return (a.applicationDate !== null) - (b.applicationDate !== null);
	});
	return valueList;
}