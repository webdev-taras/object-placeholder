// object-placeholder
// * Inspired by Placeholders.JS implemented by Chris Ferdinandi (https://gomakethings.com)

const isPlainObject = require('./is-plain-object')
const isTemplateString = require('./is-template-string')
const getValue = require('./get-value')

/**
 * Replaces placeholders with real content
 * @param  {<T>}          template  The template
 * @param  {Object}       data      The object of values to substitute
 * @param  {Object}       options   Some options
 * @return {<T>}                    The output value
 */
module.exports = (template, data = {}, options = {}) => {
	const {
		error = true,
	} = options

	const storage = {
		'{}': data, // input data
		'@': {}, // loop data
	}
	return nestedPlaceholder(template, storage, error)
}

/* eslint-disable no-nested-ternary */
/**
 * Replaces placeholders with real content including all nested properties
 * @param  {<T>}          template  The template
 * @param  {Object}       storage   The values storage
 * @param  {Boolean}      error     Throw the error or not
 * @return {<T>}                    The output value
 */
function nestedPlaceholder (template, storage, error) {
	const placeholder = (isPlainObject(template))
		? objectPlaceholder
		: (Array.isArray(template))
			? arrayPlaceholder
			: (isTemplateString(template))
				? stringPlaceholder
				: valuePlaceholder
	return placeholder(template, storage, error)
}

/**
 * Replaces placeholders in object with real content
 * @param  {Object}       template  The template array
 * @param  {Object}       storage   The values storage
 * @param  {Boolean}      error     Throw the error or not
 * @return {Object}                 The output value
 */
function objectPlaceholder (template, storage, error) {
	return Object.keys(template).reduce((obj, key) => {
		obj[key] = nestedPlaceholder(template[key], storage, error)
		return obj
	}, {})
}

/**
 * Replaces placeholders in array with real content
 * @param  {Array}        template  The template array
 * @param  {Object}       storage   The values storage
 * @param  {Boolean}      error     Throw the error or not
 * @return {Array}                  The output value
 */
function arrayPlaceholder (template, storage, error) {
	// Reference: replace the whole line by value and hold the type
	const [ first, ...block ] = template
	// Loop: all items from template replace by value for each item of specified array
	if (typeof first === 'string' && first.startsWith('@{{') && first.endsWith('}}')) {
		const { path, alias } = pathToExpresion(first)
		const array = getValue(storage, path, error, false)
		if (!Array.isArray(array)) 
    	throw new Error(`object-placeholder: path '${path}' should point to array value`)
		const output = array.map(item => {
			storage['@'][alias] = item
			return block.map(el => nestedPlaceholder(el, storage, error))
		})
		storage['@'][alias] = undefined
		return output.flat()
	} else {
		return template.map(el => nestedPlaceholder(el, storage, error))
	}
}

/**
 * Replaces placeholders in string with real content
 * @param  {String}       template  The template string
 * @param  {Object}       storage   The values storage
 * @param  {Boolean}      error     Throw the error or not
 * @return {String}                 The output value
 */
function stringPlaceholder (template, storage, error) {
	// Reference: replace the whole line by value and hold the type
	if (template.startsWith('&{{') && template.endsWith('}}')) {
		const { path } = pathToExpresion(template)
		const value = getValue(storage, path, error, false)
		return value
	}

	// Replace our curly braces with storage
	template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {
		// Remove the wrapping curly braces
		const path = match.slice(2, -2).trim()
		// Get the value
		const value = getValue(storage, path, error)
		// Replace
		return (value == null) ? '{{' + path + '}}' : value
	})

	return template
}

/**
 * Replaces placeholders with real content
 * @param  {<T>} template  The template
 * @return {<T>}           The output value
 */
function valuePlaceholder (template) {
	return template
}

/**
 * Devides string to path and alias separated by '|'
 * @param  {String} str The initial path string
 * @return {Object}     The { path, alias } object
 */
function pathToExpresion (str) {
	const name = str.substring(3, str.length-2)
	const [ first, second = 'current' ] = name.split('|')
	const path = first.trim()
	const alias = second.trim()
	return { path, alias }
}
