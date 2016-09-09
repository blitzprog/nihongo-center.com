let countryData = require('country-data')

exports.get = function*(request, response) {
	let user = request.user

	// Access level check
	if(!user || (user.accessLevel !== 'admin' && user.accessLevel !== 'staff')) {
		response.end('Unauthorized')
		return
	}

	let students = yield db.filter('Users', user => user.accessLevel === 'student')
	let courses = {}

	students.forEach(student => {
		if(!student.application || student.stage === 'apply')
			return

		let startYear = parseInt(student.profile.startYear)
		let startMonth = parseInt(student.profile.startMonth)

		if(!courses[startYear]) {
			courses[startYear] = {
				[startMonth]: [student]
			}
		} else {
			if(courses[startYear][startMonth])
				courses[startYear][startMonth].push(student)
			else
				courses[startYear][startMonth] = [student]
		}

		if(student.profile.country) {
			student.country = countryData.lookup.countries({name: student.profile.country})[0]

			if(student.country)
				student.countryCode = student.country.alpha2.toLowerCase()
		}
	})

	for(let year of Object.keys(courses)) {
		for(let month of Object.keys(courses[year])) {
			courses[year][month].sort((a, b) => {
				if(a.countryCode === undefined)
					return 1

				return a.countryCode.localeCompare(b.countryCode)
			})
		}
	}

	response.render({
		user,
		courses
	})
}
