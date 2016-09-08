let year = 1000 * 60 * 60 * 24 * 365.25

module.exports = {
	// Of
	of: function(user) {
		return this.getAge(new Date(user.profile.birthDay))
	},

	// Get age
	getAge: function(d1, d2) {
		d2 = d2 || new Date()
		let diff = d2.getTime() - d1.getTime()
		let age = Math.floor(diff / year)
		return isNaN(age) ? '-' : age
	}
}