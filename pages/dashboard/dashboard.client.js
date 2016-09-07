window.sendApplication = function(id, name) {
	let host = 'https://my.nihongo-center.com'

	$.post('/_/api/apply', {
		host,
		id,
		name
	}).then(function(response) {
		$.post('/_/', {
			id
		}).then(function() {
			location.reload()
		})
	})
}

let isStaff = document.getElementById('statistics') !== null

if(isStaff) {
	let drawGraph = function(array, id, ChartType) {
		let data = new google.visualization.arrayToDataTable(array)
		let container = document.getElementById(id)

		if(!container)
			return

		let chart = new ChartType(container)
		chart.draw(data, {})
	}

	let draw = function() {
		if(!google) {
			setTimeout(draw, 30)
			return
		}

		drawGraph(countryToStudents, 'countryChart', google.visualization.GeoChart)
		drawGraph(genderToStudents, 'genderChart', google.visualization.PieChart)
	}

	let addGoogleScript = function() {
		let script = document.createElement('script')
		script.src = 'https://www.gstatic.com/charts/loader.js'
		script.onload = () => {
			google.charts.load('current', {'packages':['corechart']})
			google.charts.setOnLoadCallback(draw)
		}

		window.googleChartsLoaded = true
		document.head.appendChild(script)
	}

	if(window.googleChartsLoaded) {
		draw()
	} else {
		addGoogleScript()
	}
}