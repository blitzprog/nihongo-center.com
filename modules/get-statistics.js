module.exports = function(students) {
	var countries = {};
	var gender = {
		male: 0,
		female: 0
	};

	students.forEach(function(student) {
		// Country
		if(student.country && student.country.length > 1) {
			if(student.country === "America")
				student.country = "United States";

			if(countries[student.country])
				countries[student.country] += 1;
			else
				countries[student.country] = 1;
		}

		// Gender
		gender[student.gender] += 1;
	});

	var totalApplicants = students.filter(function(student) {
		return student.applicationDate !== null;
	}).length;
	var applicantsAccepted = students.filter(function(student) {
		return student.stage !== "apply" && student.stage !== "rejected";
	}).length;
	var applicantsRejected = students.filter(function(student) {
		return student.stage === "declined";
	}).length;
	var applicantsRemaining = statistics.totalApplicants - statistics.applicantsAccepted - statistics.applicantsRejected

	return {
		totalStudents: students.length,
		totalApplicants: totalApplicants,
		applicantsAccepted: applicantsAccepted,
		applicantsRejected: applicantsRejected,
		applicantsRemaining: applicantsRemaining,
		countries: countries,
		gender: gender
	};
};
