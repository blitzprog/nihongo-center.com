google.load("visualization", "1", {packages:["corechart"]});

function drawGraph(array, id) {
	var data = google.visualization.arrayToDataTable(array);
	var chart = new google.visualization.PieChart(document.getElementById(id));
	chart.draw(data, {});
}

var onReady = function() {
	document.removeEventListener("DOMContentLoaded", onReady, false);
	
	// Draw
	drawGraph(countryToStudents, "countryChart");
	drawGraph(genderToStudents, "genderChart");
};

document.addEventListener("DOMContentLoaded", onReady, false);