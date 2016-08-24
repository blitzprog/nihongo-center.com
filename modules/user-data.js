module.exports = {
	// Personal
	email: "",
	givenName: "",
	familyName: "",
	gender: "",
	language: "",

	// System
	accessLevel: "student",
	stage: "apply",
	applicationDate: null,
	registrationDate: null,

	country: "",
	nationality: "",
	maritalStatus: "",
	birthDay: "",
	birthPlace: "",
	occupation: "",
	occupationType: "",
	address: "",
	addressAbroad: "",
	telephone: "",
	telephoneAbroad: "",
	contactEmail: "",

	// Course
	course: "",
	startYear: "",
	startMonth: "",

	// Education
	education: "",
	educationalInstitutionName: "",
	graduationDate: "",
	planAfterGraduation: "",
	totalPeriodOfEducation: null,

	// Passport
	passportId: "",
	passportDateOfExpiration: "",

	// Family
	familyMembers: [],
	relativesAbroad: [],

	// Financial
	paymentMethod: "",
	financialSupporters: [],
	financialSupportPerMonth: {
		self: 0,
		remittanceFromOutside: 0,
		carryingFromAbroad: 0,
		guarantorAbroad: 0,
		scholarship: 0,
		others: 0
	},

	// Visa
	portOfEntry: "",
	visaApplicationPlace: "",
	numberOfPastEntries: null,
	lastEntryFrom: "",
	lastEntryTo: "",

	// Japanese
	jlptLevel: "",
	japaneseEducation: [],
	reasonForStudying: "",

	// Uploads
	uploads: []
};