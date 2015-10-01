function drawGraph(array, id) {
	var data = google.visualization.arrayToDataTable(array);
	var container = document.getElementById(id);
	
	console.log(array, id, container);
	
	if(!container)
		return;
	
	var chart = new google.visualization.PieChart(container);
	chart.draw(data, {});
}

var onReady = function() {
	document.removeEventListener("DOMContentLoaded", onReady, false);
	
	// Draw
	drawGraph(countryToStudents, "countryChart");
	drawGraph(genderToStudents, "genderChart");
};

document.addEventListener("DOMContentLoaded", onReady, false);