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

	let students = yield db.filter('Users', user => user.accessLevel === 'student')

	let exactDateSearch = false

	if(/^[0-9]{1,2}.[0-9]{4}$/.test(term)) {
		exactDateSearch = true
	}

	students = students.filter(student => {
		if(term !== '*') {
			if(exactDateSearch) {
				if(!student.profile.startMonth || !student.profile.startYear || student.profile.startMonth + '-' + student.profile.startYear !== term) {
					return false
				}
			} else {
				let found = searchProperties.some(function(key) {
					let value = student.profile[key]

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
					found = (student.email.indexOf(term) !== -1) || (student.profile.contactEmail.indexOf(term) !== -1)

				if(!found)
					return false
			}
		}

		student.age = age.of(student)
		student.permaLink = '/student/' + student.id
		student.profileCompleted = getStudentProgress(student)

		if(student.profile.country) {
			let countryObject = lookup.countries({name: student.profile.country})[0]
			if(countryObject)
				student.countryCode = countryObject.alpha2.toLowerCase()
		}

		return true
	})

	students.sort((a, b) => b.profileCompleted - a.profileCompleted)

	response.render({
		user,
		students
	})
}