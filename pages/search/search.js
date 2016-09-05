let age = require('../../modules/age')
let getStudentProgress = require('../../modules/get-student-progress')

// Country data
let countryData = require('country-data')
let lookup = countryData.lookup

const searchProperties = [
	'givenName',
	'familyName',
	'gender',
	'startYear',
	'country',
	'jlptLevel'
]

exports.get = function*(request, response) {
	let user = request.user
	let term = request.params[0]

	if(!term)
		term = '*'
	else
		term = term.toLowerCase()

	if(!user) {
		response.render()
		return
	}

	let students = yield app.db.filter('Users', user => user.accessLevel === 'student')

	let exactDateSearch = false

	if(/^[0-9]{1,2}.[0-9]{4}$/.test(term)) {
		exactDateSearch = true
	}

	students = students.map(student => {
		if(term !== '*') {
			if(exactDateSearch) {
				if(!student.profile.startMonth || !student.profile.startYear || student.profile.startMonth + '-' + student.profile.startYear !== term) {
					return null
				}
			} else {
				let found = searchProperties.some(function(key) {
					let value = student[key]

					if(value === null)
						return false

					if(typeof value !== 'string')
						return false

					if(key === 'gender' && value !== term)
						return false

					if(value.toLowerCase().indexOf(term) !== -1)
						return true

					return false
				})

				// Name: Western style
				if(!found)
					found = (student.profile.givenName + ' ' + student.profile.familyName).toLowerCase().indexOf(term) !== -1

				// Name: Japanese style
				if(!found)
					found = (student.profile.familyName + ' ' + student.profile.givenName).toLowerCase().indexOf(term) !== -1

				if(!found)
					return null
			}
		}

		student.age = age.of(student)
		student.permaLink = '/student/' + student.email
		student.profileCompleted = getStudentProgress(student)

		if(student.profile.country) {
			let countryObject = lookup.countries({name: student.profile.country})[0]
			if(countryObject)
				student.countryCode = countryObject.alpha2.toLowerCase()
		}

		return student
	}).filter(student => {
		return student !== null
	})

	students.sort((a, b) => {
		let appliedFactor = (b.application !== null) - (a.application !== null)
		let progressFactor = b.profileCompleted - a.profileCompleted
		let registeredFactor = Math.sign(Date.parse(b.registration) - Date.parse(a.registration))
		let courseFactor = 0

		if(a.profile.startYear && b.profile.startYear) {
			if(b.profile.startYear === a.profile.startYear && a.profile.startMonth && b.profile.startMonth)
				courseFactor = Math.sign(parseInt(a.profile.startMonth) - parseInt(b.profile.startMonth))
			else
				courseFactor = Math.sign(parseInt(a.profile.startYear) - parseInt(b.profile.startYear))
		}

		return registeredFactor + courseFactor * 2 + progressFactor * 4 + appliedFactor * 8
	})

	//if(students.length > 40)
	//	students.length = 40

	response.render({
		user,
		students
	})
}