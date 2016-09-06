const disabledStages = ['apply', 'denied', 'canceled']

exports.get = function*(request, response) {
	let user = request.user

	let students = yield db.filter('Users', user => user.accessLevel === 'student')
	let courses = {}

	students.forEach(student => {
		if(!student.application && disabledStages.indexOf(student.stage) === -1)
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
	})

	response.render({
		user,
		courses
	})
}
