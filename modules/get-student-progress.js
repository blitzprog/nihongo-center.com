const notRequiredFields = [
	'email',
	'accessLevel',
	'stage',
	'relativesAbroad',
	'financialSupportPerMonth',
	'addressAbroad',
	'telephoneAbroad',
	'japaneseEducation',
	'lastEntryFrom',
	'lastEntryTo',
	'uploads',
	'registration',
	'application'
]
const atLeastOneElement = [
	'familyMembers',
	'financialSupporters'
]
const fields = Object.keys(require('../data/user-data').profile)

module.exports = function(user, missingFields) {
	let progress = 0


	// Prevent division by zero
	if(fields.length !== 0) {
		let notRequiredFieldCount = 0
		let completedFields = fields.map(function(property) {
			// These don't need to be filled out
			if(notRequiredFields.indexOf(property) !== -1) {
				notRequiredFieldCount += 1
				return 0
			}

			// Arrays that need at least 1 element
			if(atLeastOneElement.indexOf(property) !== -1 && user.profile[property].length === 0) {
				if(missingFields !== undefined)
					missingFields.push(property)
				return 0
			}

			if(typeof user.profile[property] === 'undefined' || user.profile[property] === '' || user.profile[property] === null) {
				if(missingFields !== undefined)
					missingFields.push(property)
				return 0
			}

			return 1
		}).reduce(function(a, b) {
			return a + b
		})

		progress = Math.round(completedFields / (fields.length - notRequiredFieldCount) * 100)

		if(progress > 100)
			progress = 100
	}

	return progress
}