const disabledStages = ['apply', 'denied', 'canceled']

exports.get = function*(request, response) {
	let user = request.user
	let year = parseInt(request.params[0])
	let month = parseInt(request.params[1])

	let students = yield db.filter('Users', user => user.accessLevel === 'student')

	let course = {
		students: []
	}

	students.forEach(student => {
		if(!student.application || disabledStages.indexOf(student.stage) !== -1)
			return

		let startYear = parseInt(student.profile.startYear)
		let startMonth = parseInt(student.profile.startMonth)

		if(startYear === year && startMonth === month)
			course.students.push(student)
	})

	response.render({
		user,
		year,
		month,
		course
	})
}