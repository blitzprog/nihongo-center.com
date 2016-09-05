let availableLanguages = require('../data/languages')
let i18n = require('i18n')

console.log('Initializing i18n')

// Translations
i18n.configure({
	locales: availableLanguages,
	defaultLocale: 'en',
	directory: 'locales',
	objectNotation: true
})

// Translation
app.use(i18n.init)

// Apply user language setting to each request/response
app.use(function(req, res, next) {
	if(req.user && req.user.language) {
		req.user.language = req.user.language.substring(0, 2)
		if(availableLanguages.indexOf(req.user.language) !== -1) {
			req.locale = req.user.language
			req.setLocale(req.user.language)
		}
	}

	next()
})

// Translation functions
app.use(function(request, response, next) {
	request.globals = {
		__: request.__
	}
	next()
})