// object-placeholder
// * Inspired by Placeholders.JS implemented by Chris Ferdinandi (https://gomakethings.com)

const isPlainObject = require('./is-plain-object')
const isTemplateString = require('./is-template-string')
const getValue = require('./get-value')
const deepClone = require('./deep-clone')

/**
 * Replaces placeholders with real content
 * @param  {<T>}          template  The template
 * @param  {Object}       data      The object of values to substitute
 * @param  {Object}       options   Some options
 * @return {<T>}                    The output value
 */
module.exports = (template, data = {}, options = {}) => {
	const {
		error = true, // Throw the error or not when template was not resolved
		clone = true, // Clone the output value or not
	} = options
	const settings = {
		error,
		clone: (clone) ? deepClone : value => value
	}
	const storage = {
		'{}': data, // input data
		'@': {}, // loop data
	}
	return nestedPlaceholder(template, storage, settings)
}

/* eslint-disable no-nested-ternary */
/**
 * Replaces placeholders with real content including all nested properties
 * @param  {<T>}          template  The template
 * @param  {Object}       storage   The values storage
 * @param  {Object}       settings  Some settings
 * @return {<T>}                    The output value
 */
function nestedPlaceholder (template, storage, settings) {
	const placeholder = (isPlainObject(template))
		? objectPlaceholder
		: (Array.isArray(template))
			? arrayPlaceholder
			: (isTemplateString(template))
				? stringPlaceholder
				: valuePlaceholder
	return placeholder(template, storage, settings)
}

/**
 * Replaces placeholders in object with real content
 * @param  {Object}       template  The template array
 * @param  {Object}       storage   The values storage
 * @param  {Object}       settings  Some settings
 * @return {Object}                 The output value
 */
function objectPlaceholder (template, storage, settings) {
	return Object.keys(template).reduce((obj, key) => {
		obj[key] = nestedPlaceholder(template[key], storage, settings)
		return obj
	}, {})
}

/**
 * Replaces placeholders in array with real content
 * @param  {Array}        template  The template array
 * @param  {Object}       storage   The values storage
 * @param  {Object}       settings  Some settings
 * @return {Array}                  The output value
 */
function arrayPlaceholder (template, storage, settings) {
	// Reference: replace the whole line by value and hold the type
	const [ first, ...block ] = template
	// Loop: all items from template replace by value for each item of specified array
	if (typeof first === 'string' && first.startsWith('@{{') && first.endsWith('}}')) {
		const { path, alias } = pathToExpresion(first)
		const array = getValue(storage, path, settings)
		if (!Array.isArray(array)) 
    	throw new Error(`object-placeholder: path '${path}' should point to array value`)
		const output = array.map(item => {
			storage['@'][alias] = item
			return block.map(el => nestedPlaceholder(el, storage, settings))
		})
		storage['@'][alias] = undefined
		return output.flat()
	} else {
		return template.map(el => nestedPlaceholder(el, storage, settings))
	}
}

/**
 * Replaces placeholders in string with real content
 * @param  {String}       template  The template string
 * @param  {Object}       storage   The values storage
 * @param  {Object}       settings  Some settings
 * @return {String}                 The output value
 */
function stringPlaceholder (template, storage, settings) {
	// Reference: replace the whole line by value and hold the type
	if (template.startsWith('&{{') && template.endsWith('}}')) {
		const { path } = pathToExpresion(template)
		const value = getValue(storage, path, settings)
		return (value == null) ? '&{{' + path + '}}' : valuePlaceholder(value, storage, settings)
	}

	// Replace our curly braces with storage
	template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {
		// Remove the wrapping curly braces
		const path = match.slice(2, -2).trim()
		// Get the value
		const value = getValue(storage, path, settings)
		// TODO: replace by stringify function
		// TODO: define 'empty' function to define significant value
		return (value == null)
			? '{{' + path + '}}'
			: (typeof value === 'object')
				? JSON.stringify(value)
				: value
	})

	return template
}

/**
 * Replaces placeholders with real content
 * @param  {<T>}          value    The template
 * @param  {Object}       storage  The values storage
 * @param  {Object}       settings Some settings
 * @return {<T>}                   The output value
 */
function valuePlaceholder (value, storage, settings) {
	return (typeof value !== 'object' || value === null)
		? value
		: settings.clone(value)
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
