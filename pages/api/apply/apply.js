const fetch = require('request-promise')

exports.post = (request, response) => {
	let host = request.body.host
	let id = request.body.id
	let name = request.body.name

	if(!host || !id || !name)
		return response.end()

	let url = 'https://hooks.slack.com/services/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'
	let data = {
		text: '<' + host + '/student/' + id + '|' + name + '>'
	}

	return fetch({
		method: 'POST',
		uri: url,
		body: data,
		json: true
	}).then(() => response.end())
}