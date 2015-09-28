google.load("visualization", "1", {packages:["corechart"]});
//google.setOnLoadCallback(drawChart);

function drawChart() {
	var data = google.visualization.arrayToDataTable(countryToStudents);

	var options = {
		title: 'Countries'
	};

	var chart = new google.visualization.PieChart(document.getElementById('countryChart'));

	chart.draw(data, options);
}

var onReady = function() {
	document.removeEventListener("DOMContentLoaded", onReady, false);
	
	// Chart
	drawChart();
};

document.addEventListener("DOMContentLoaded", onReady, false);