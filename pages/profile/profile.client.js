// Save
window.save = function() {
	let page = 'profile'
	let key = this.name
	let value = this.value
	let dataType = 'text'

	if(this.classList.contains('number-input')) {
		value = parseInt(value)
		dataType = 'numeric'
	}

	$.fadeIn($('loading-animation'))

	$.post('/_/' + page, {
		func: 'saveProfile',
		key: key,
		value: value,
		dataType: dataType
	}).then(function(response) {
		window.updateContent(page, response)
		$.fadeOut($('loading-animation'))
	})
}

// Save array element
window.saveArrayElement = function() {
	let page = 'profile'
	let array = this.dataset.array
	let index = this.dataset.index
	let key = this.dataset.key
	let value = this.value
	let dataType = 'text'

	if(this.classList.contains('array-number-input')) {
		value = parseInt(value)
		dataType = 'numeric'
	}

	$.fadeIn($('loading-animation'))

	$.post('/_/' + page, {
		func: 'saveArrayElement',
		array,
		index,
		key,
		value,
		dataType
	}).then(function(response) {
		window.updateContent(page, response)
		$.fadeOut($('loading-animation'))
	})
}

// Save object
window.saveObject = function() {
	let page = 'profile'
	let object = this.dataset.object
	let key = this.dataset.key
	let value = this.value
	let dataType = 'text'

	if(this.classList.contains('object-number-input')) {
		value = parseInt(value)
		dataType = 'numeric'
	}

	$.fadeIn($('loading-animation'))

	$.post('/_/' + page, {
		func: 'saveObject',
		object: object,
		key: key,
		value: value,
		dataType: dataType
	}).then(function(response) {
		window.updateContent(page, response)
		$.fadeOut($('loading-animation'))
	})
}

// On content loaded
jQuery('select').change(save)
jQuery('.text-input').change(save)
jQuery('.date-input').blur(save)
jQuery('.tel-input').change(save)
jQuery('.number-input').change(save)
jQuery('.object-number-input').change(saveObject)
jQuery('.array-text-input').change(saveArrayElement)
jQuery('.array-number-input').change(saveArrayElement)