let monthsBefore = 1

module.exports = function(__, startYear) {
	startYear = parseInt(startYear)
	let currentYear = new Date().getFullYear()
	let currentMonth = new Date().getMonth()

	let months = {}

	// Short courses
	months['01'] = __('monthNames.1')
	months['06'] = __('monthNames.6')

	// Invalid year
	if(startYear < currentYear)
		return months

	// Same year
	if(startYear === currentYear) {
		if(currentMonth <= 3 - monthsBefore)
			months['04'] = __('monthNames.4')
		if(currentMonth <= 9 - monthsBefore)
			months['10'] = __('monthNames.10')
		return months
	}

	// Next year
	if(startYear === currentYear + 1) {
		if(currentMonth <= 15 - monthsBefore)
			months['04'] = __('monthNames.4')
		if(currentMonth <= 21 - monthsBefore)
			months['10'] = __('monthNames.10')
	}

	return months
}