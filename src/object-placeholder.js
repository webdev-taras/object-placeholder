// object-placeholder
// * Inspired by Placeholders.JS implemented by Chris Ferdinandi (https://gomakethings.com)

const isObject = require('./is-plain-object')

module.exports = (template, data = {}, options = {}) => {
	const {
		error = true,
	} = options

	const storage = {
		'{}': data,
		'@': {},
	}
	return nestedPlaceholder(template, storage, error)
}

/* eslint-disable no-nested-ternary */
function nestedPlaceholder (template, storage, error) {
	const placeholder = (isObject(template))
		? objectPlaceholder
		: (Array.isArray(template))
			? arrayPlaceholder
			: (isStringTemplate(template))
				? stringPlaceholder
				: valuePlaceholder
	return placeholder(template, storage, error)
}

function objectPlaceholder (template, storage, error) {
	return Object.keys(template).reduce((obj, key) => {
		obj[key] = nestedPlaceholder(template[key], storage, error)
		return obj
	}, {})
}

function arrayPlaceholder (template, storage, error) {
	// Reference: replace the whole line by value and hold the type
	const [ first, ...block ] = template
	// Loop: all items from template replace by value for each item of specified array
	if (typeof first === 'string' && first.startsWith('@{{') && first.endsWith('}}')) {
		const { path, alias } = stringToExpresion(first)
		const array = getExpanded(storage, path, error, false)
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

function valuePlaceholder (template, storage, error) {
	return template
}

function isStringTemplate (template) {
	return (typeof template === 'string' && template.includes('{{'))
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
	const output = []

	// Split to an array with dot notation
	path.split('.').forEach(function (item) {

		// Split to an array with bracket notation
		item.split(/\[([^}]+)\]/g).forEach(function (key) {

			// Push to the new array
			if (key.length > 0) {
				output.push(key)
			} // TODO: else should be an error

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
function get (obj, path, error) {

	// Get the path as an array
	path = stringToPath(path)

	// Cache the current object
	let current = obj

	// For each item in the path, dig into the object
	for (let i = 0; i < path.length; i++) {
		// update the current  value
		// TODO: need to manage case with array index number like [1]
		current = current[path[i]]

		// If the item isn't found, return the default (or undefined)
		if (current == null) {
			if (error)
    		throw new Error(`object-placeholder: undefined value by path '${path.join('.')}'`)
			else
				return current
		}
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
function getExpanded (storage, inputPath, error, stringify = true) {
	
	// Get the path as an array
	const path = stringToPath(inputPath)

	let [ root ] = path
	if (root === '@') {
		path.shift()
	} else {
		root = '{}' // by default
	}
	const obj = storage[root]

	const data = get(obj, path, error)

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
function stringPlaceholder (template, data, error) {
	// Reference: replace the whole line by value and hold the type
	if (template.startsWith('&{{') && template.endsWith('}}')) {
		const { path } = stringToExpresion(template)
		const value = getExpanded(data, path, error, false)
		return value
	}

	// Replace our curly braces with data
	template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {
		// Remove the wrapping curly braces
		const path = match.slice(2, -2).trim()
		// Get the value
		const value = getExpanded(data, path, error)
		// Replace
		return (value == null) ? '{{' + path + '}}' : value
	})

	return template
}
