// object-placeholder
// * Inspired by Placeholders.JS implemented by Chris Ferdinandi (https://gomakethings.com)

const isObject = require('./is-plain-object')

module.exports = (template, data, options = {}) => {
	const {
		nested = true,
		// error = true,
	} = options
	const recursiveFunction = nested ? proceedTheObject : placeholders
	return proceedTheObject(template, data, recursiveFunction)
}

/* eslint-disable no-nested-ternary */
function proceedTheObject (template, data, recursiveFunction) {
	return (isObject(template))
		? Object.keys(template).reduce((obj, key) => {
				try {
					obj[key] = recursiveFunction(template[key], data, recursiveFunction)
				} catch(err) {
					obj[key] = template[key]
				}
				return obj
			}, {})
		: (Array.isArray(template))
			? template.map(el => recursiveFunction(el, data, recursiveFunction))
			: placeholders(template, data)
}

/**
 * If the path is a string, convert it to an array
 * @param  {String|Array} path The path
 * @return {Array}             The path array
 */
function stringToPath (path) {

	// If the path isn't a string, return it
	if (typeof path !== 'string') return path

	// Create new array
	let output = []

	// Split to an array with dot notation
	path.split('.').forEach(function (item) {

		// Split to an array with bracket notation
		item.split(/\[([^}]+)\]/g).forEach(function (key) {

			// Push to the new array
			if (key.length > 0) {
				output.push(key)
			}

		})

	})

	return output
}

/**
 * Get an object value from a specific path
 * @param  {Object}       obj  The object
 * @param  {String|Array} path The path
 * @param  {*}            def  A default value to return [optional]
 * @return {*}                 The value
 */
function get (obj, path, def) {

	// Get the path as an array
	path = stringToPath(path)

	// Cache the current object
	let current = obj

	// For each item in the path, dig into the object
	for (let i = 0; i < path.length; i++) {

		// If the item isn't found, return the default (or null)
		if (current[path[i]] == null) return def

		// Otherwise, update the current  value
		current = current[path[i]]

	}

	return current
}

function getExpanded (obj, inputPath, def) {
	
	// Get the path as an array
	const path = stringToPath(inputPath)

	const data = get(obj, path, def)

	const result = (typeof data === 'object')
		? JSON.stringify(data)
		: data

	return result
}

/**
 * Replaces placeholders with real content
 * @param {String} template The template string
 * @param {String} local    A local placeholder to use, if any
 */
function placeholders (template, data) {

	if (typeof template !== 'string') 
    throw new Error('object-placeholder: please provide a valid template')

	// If no data, return template as-is
	// TODO: options.error should manage this case
	if (!data) return template

	// Reference: replace the whole line by value and hold the type
	if (template.startsWith('&{{') && template.endsWith('}}')) {
		const path = template.substring(3,template.length-2)
		const value = get(data, path)
		return value
	}

	// Replace our curly braces with data
	template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {

		// Remove the wrapping curly braces
		match = match.slice(2, -2)

		// Get the value
		var val = getExpanded(data, match)

		// Replace
		if (!val) return '{{' + match + '}}'
		return val

	})

	return template
}
