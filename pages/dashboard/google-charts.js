function drawGraph(array, id, geoChart) {
	let data = google.visualization.arrayToDataTable(array)
	let container = document.getElementById(id)
	
	console.log(array, id, container)
	
	if(!container)
		return
	
	let chart = geoChart ? new google.visualization.GeoChart(container) : new google.visualization.PieChart(container)
	chart.draw(data, {})
}

let onReady = function() {
	document.removeEventListener('DOMContentLoaded', onReady, false)
	
	// Draw
	drawGraph(countryToStudents, 'countryChart', true)
	drawGraph(genderToStudents, 'genderChart', false)
}

document.addEventListener('DOMContentLoaded', onReady, false)