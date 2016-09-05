let fs = require('fs')
let S = require('string')
let age = require('../../modules/age')
let mimeTypes = require('mime-types')
let sumOfValues = require('../../modules/sumOfValues')
let getCountry = require('../../modules/getCountry')

module.exports = {
	get: function*(request, response) {
		let email = request.params[0]
		let __ = request.__

		if(!email) {
			response.end()
			return
		}

		let student = yield app.db.get('Users', email)

		student.age = age.of(student)
		student.displayName = student.profile.givenName + ' ' + student.profile.familyName
		student.heShe = student.profile.gender === 'male' ? 'He' : 'She'
		student.hisHer = student.profile.gender === 'male' ? 'his' : 'her'
		student.heSheJp = student.profile.gender === 'male' ? '彼' : '彼女'
		student.startMonthName = __('monthNames.' + parseInt(student.profile.startMonth))

		// Create an inverted dictionary based on fileTypes
		let humanized = Object.keys(student).reduce(function(dict, key) {
			if(key)
				dict[key] = S(key).humanize().s

			return dict
		}, {})

		let description = ''

		if(student.age && student.profile.maritalStatus)
			description += `${student.displayName} is ${student.age} years old and ${student.profile.maritalStatus}. `
		else if(student.age)
			description += `${student.displayName} is ${student.age} years old. `
		else if(student.maritalStatus)
			description += `${student.displayName} is ${student.maritalStatus}. `

		description += `${student.heShe} is from ${student.profile.country} and wants to start a ${student.profile.course} course in ${student.profile.startMonthName} ${student.profile.startYear}. `

		if(student.profile.familyMembers.length === 0)
			description += `${student.heShe} has no family members.`
		else if(student.profile.familyMembers.length === 1)
			description += `${S(student.hisHer).capitalize().s} only family member is ${student.profile.familyMembers[0].name}.`
		else
			description += `There are ${student.profile.familyMembers.length} people in ${student.hisHer} family.`

		student.profile.financialSupportPerMonth.total = sumOfValues(student.profile.financialSupportPerMonth)
		description += ` ${student.heShe} will bring ${student.profile.financialSupportPerMonth.total} Yen per month.`

		//let japaneseDescription = `${student.givenName}は${student.age}歳です. `
		//japaneseDescription += `${student.heSheJp}は${student.country}住んでいて、${student.startYear}年${student.startMonth}月の${student.course}コースに入りたいです。`

		for(let key of ['heShe', 'heSheJp', 'hisHer', 'startMonthName']) {
			delete student[key]
		}

		let country = null

		if(student.profile.country) {
			country = getCountry(student.profile.country)
		}

		if(student.uploads.length > 0) {
			for(let i = 0; i < student.uploads.length; i++) {
				student.uploads[i].purposeHumanized = S(student.uploads[i].purpose).humanize().s
			}
		}

		response.render({
			user: request.user,
			country,
			student,
			humanized,
			description,
			mimeTypes,
			translateOptions: {
				'gender': true,
				'maritalStatus': true,
				'occupationType': true,
				'education': true,
				'planAfterGraduation': true,
				'paymentMethod': true,
				'jlptLevel': true,
				'portOfEntry': true
			},
			keysNotRendered: {
				'uploads': true,
				'familyMembers': true,
				'financialSupporters': true,
				'japaneseEducation': true,
				'financialSupportPerMonth': true,
				'stage': true,
				'reasonForStudying': true,
				'accessLevel': true,
				'displayName': true
			}
		})
	},

	// Post: Save
	post: function(request, response) {
		if(!request.body.func) {
			response.writeHead(400)
			response.end()
			return
		}

		this[request.body.func](request, response)
	},

	// Save stage
	saveStage: function(request, response) {
		let email = request.body.email
		let stageName = request.body.stageName

		app.db.get('Users', email).then(student => {
			student.stage = stageName

			// Save in DB
			app.db.saveUser(student)

			response.end()
		})
	}
}
