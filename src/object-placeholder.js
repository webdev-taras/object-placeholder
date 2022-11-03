// object-placeholder
// * Inspired by Placeholders.JS implemented by Chris Ferdinandi (https://gomakethings.com)

const isObject = require('./is-plain-object')

module.exports = (template, data, options = {}) => {
	const {
		nested = true,
		// error = true,
	} = options

	const storage = {
		'{}': data,
		'@': {},
	}
	const recursiveFunction = nested ? nestedPlaceholder : stringPlaceholder
	return nestedPlaceholder(template, storage, recursiveFunction)
}

/* eslint-disable no-nested-ternary */
function nestedPlaceholder (template, storage, recursiveFunction) {
	const placeholder = (isObject(template))
		? objectPlaceholder
		: (Array.isArray(template))
			? arrayPlaceholder
			: stringPlaceholder
	return placeholder(template, storage, recursiveFunction)
}

function objectPlaceholder (template, storage, recursiveFunction) {
	return Object.keys(template).reduce((obj, key) => {
		try {
			obj[key] = recursiveFunction(template[key], storage, recursiveFunction)
		} catch(err) {
			obj[key] = template[key]
		}
		return obj
	}, {})
}

function arrayPlaceholder (template, storage, recursiveFunction) {
	// Reference: replace the whole line by value and hold the type
	const [ first, ...block ] = template
	// Loop: all items from template replace by value for each item of specified array
	if (typeof first === 'string' && first.startsWith('@{{') && first.endsWith('}}')) {
		const { path, alias } = stringToExpresion(first)
		const array = getExpanded(storage, path, undefined, false)
		if (!Array.isArray(array)) 
    	throw new Error(`object-placeholder: path '${path}' should point to array value`)
		const output = array.map(item => {
			storage['@'][alias] = item
			return block.map(el => recursiveFunction(el, storage, recursiveFunction))
		})
		storage['@'][alias] = undefined
		return output.flat()
	} else {
		return template.map(el => recursiveFunction(el, storage, recursiveFunction))
	}
}

/**
 * Devides string to path and alias separated by '|'
 * @param  {String} str The initial path string
 * @return {Object}     The { path, alias } object
 */
function stringToExpresion (str) {
	const name = str.substring(3, str.length-2)
	const [ first, second = 'current' ] = name.split('|')
	const path = first.trim()
	const alias = second.trim()
	return { path, alias }
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

		// If the item isn't found, return the default (or undefined)
		if (current[path[i]] == null) return def

		// Otherwise, update the current  value
		current = current[path[i]]

	}

	return current
}

/**
 * Get a value from storage by specific path 
 * @param  {Object}       obj  The object
 * @param  {String|Array} path The path
 * @param  {*}            def  A default value to return [optional]
 * @param  {Boolean}      stringify Converte to string the output value 
 * @return {*}                 The output value
 */
function getExpanded (storage, inputPath, def, stringify = true) {
	
	// Get the path as an array
	const path = stringToPath(inputPath)

	let [ root ] = path
	if (root === '@') {
		path.shift()
	} else {
		root = '{}' // by default
	}
	const obj = storage[root]

	const data = get(obj, path, def)

	const result = (stringify && typeof data === 'object')
		? JSON.stringify(data)
		: data

	return result
}

/**
 * Replaces placeholders with real content
 * @param {String} template The template string
 * @param {String} local    A local placeholder to use, if any
 */
function stringPlaceholder (template, data) {

	if (typeof template !== 'string') 
    throw new Error('object-placeholder: please provide a valid string template')

	// If no data, return template as-is
	// TODO: options.error should manage this case
	if (!data) return template

	// Reference: replace the whole line by value and hold the type
	if (template.startsWith('&{{') && template.endsWith('}}')) {
		const { path } = stringToExpresion(template)
		const value = getExpanded(data, path, undefined, false)
		return value
	}

	// Replace our curly braces with data
	template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {
		// Remove the wrapping curly braces
		const path = match.slice(2, -2).trim()
		// Get the value
		var value = getExpanded(data, path)
		// Replace
		return (value == null) ? '{{' + path + '}}' : value
	})

	return template
}
