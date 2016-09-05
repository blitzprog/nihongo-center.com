let fs = require('fs')
let countryData = require('country-data')
let lookup = countryData.lookup
let currencies = countryData.currencies
let languages = countryData.languages

let loadFileAsArray = function(filePath) {
	return fs.readFileSync(filePath, 'utf8').toString().split('\n')
}

let visaEasy = loadFileAsArray('data/visa-easy-countries.txt').reduce(function(dict, value) {
	dict[value] = null
	return dict
}, {})

module.exports = function(countryName) {
	let country = lookup.countries({name: countryName})[0]

	if(country) {
		country.currencies = country.currencies.map(function(currencyCode) {
			let currency = currencies[currencyCode]

			if(currency)
				return `${currency.name} (${currencyCode})`

			return currencyCode
		})

		country.languages = country.languages.map(function(languageCode) {
			let language = languages[languageCode]

			if(language)
				return language.name

			return languageCode
		})

		country.visaEasy = visaEasy[country.name] !== undefined
	}

	return country
}