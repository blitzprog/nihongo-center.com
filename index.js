global.app = require('aero')()

if(!app.production)
	console.log('Development Version')

app.sendRegistrationMessageToSlack = function(student) {
	if(!app.production)
		return

	let host = 'https://my.nihongo-center.com'
	let webhook = 'https://hooks.slack.com/services/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'

	require('request').post({
		url: webhook,
		body: JSON.stringify({
			text: '<' + host + '/student/' + student.email + '|' + student.givenName + ' ' + student.familyName + ' (' + student.email + ')>'
		}), function(err, res, body) {
			if(err)
				console.error(err, err.stack)
			else
				console.log('Sent slack message.')
		}
	})
}

app.use(require('body-parser').json())

app.run()