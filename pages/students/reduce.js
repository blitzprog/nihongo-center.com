// Currently not in use

function(valueList) {
	valueList.sort(function(a, b) {
		return (a.applicationDate !== null) - (b.applicationDate !== null);
	});
	return valueList;
}