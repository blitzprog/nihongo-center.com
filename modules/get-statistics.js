let age = require('./age')

module.exports = function(students) {
	let countries = {}
	let gender = {
		male: 0,
		female: 0
	}
	let ageGroups = {}

	students.forEach(function(student) {
		if(student.stage === 'apply' || student.stage === 'declined' || student.stage === 'canceled')
			return

		// Country
		if(student.profile.country && student.profile.country.length > 1) {
			if(student.profile.country === 'America')
				student.profile.country = 'United States'

			if(countries[student.profile.country])
				countries[student.profile.country] += 1
			else
				countries[student.profile.country] = 1
		}

		// Age
		if(student.profile.birthDay) {
			student.age = age.of(student)
			if(isNaN(student.age) || student.age <= 10 || student.age >= 120)
				return

			if(ageGroups[student.age])
				ageGroups[student.age] += 1
			else
				ageGroups[student.age] = 1
		}

		// Gender
		gender[student.profile.gender] += 1
	})

	let totalApplicants = students.filter(function(student) {
		return student.application
	}).length

	let applicantsAccepted = students.filter(function(student) {
		return student.stage !== 'apply' && student.stage !== 'declined' && student.stage !== 'canceled'
	}).length

	let applicantsRejected = students.filter(function(student) {
		return student.stage === 'declined' || student.stage === 'canceled'
	}).length

	let applicantsRemaining = totalApplicants - applicantsAccepted - applicantsRejected

	return {
		totalStudents: students.length,
		totalApplicants,
		applicantsAccepted,
		applicantsRejected,
		applicantsRemaining,
		countries,
		gender,
		ageGroups
	}
}
