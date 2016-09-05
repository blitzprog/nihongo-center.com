let countryData = require('country-data')

exports.get = function*(request, response) {
	let user = request.user

	if(!user) {
		response.render()
		return
	}

	user.isStaff = user.accessLevel === 'admin' || user.accessLevel === 'staff'

	if(!user.isStaff) {
		response.render({
			user
		})
		return
	}

	let stages = {}
	let students = yield app.db.filter('Users', user => user.accessLevel === 'student')

	students.forEach(student => {
		if(!student.application && student.stage === 'apply')
			return

		if(!stages[student.stage]) {
			stages[student.stage] = [student]
		} else {
			stages[student.stage].push(student)
		}

		if(student.profile.country) {
			let countryObject = countryData.lookup.countries({
				name: student.profile.country
			})[0]

			if(countryObject)
				student.countryCode = countryObject.alpha2.toLowerCase()
		}
	})

	// Render the page
	response.render({
		user,
		stages
	})
}