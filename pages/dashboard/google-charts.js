function drawGraph(array, id, geoChart) {
	var data = google.visualization.arrayToDataTable(array);
	var container = document.getElementById(id);
	
	console.log(array, id, container);
	
	if(!container)
		return;
	
	var chart = geoChart ? new google.visualization.GeoChart(container) : new google.visualization.PieChart(container);
	chart.draw(data, {});
}

var onReady = function() {
	document.removeEventListener("DOMContentLoaded", onReady, false);
	
	// Draw
	drawGraph(countryToStudents, "countryChart", true);
	drawGraph(genderToStudents, "genderChart", false);
};

document.addEventListener("DOMContentLoaded", onReady, false);