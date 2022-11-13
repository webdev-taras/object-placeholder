module.exports = getValue

/**
 * Get a value from storage by specific path 
 * @param  {Object}       storage   The values storage
 * @param  {String}       path      The path
 * @param  {Object}       sample    The template string
 * @param  {Object}       settings  Some settings
 * @return {*}                      The output value
 */
function getValue (storage, path, sample, settings) {
	
	// Get the path as an array
	const chain = pathToChain(path)

	let [ root ] = chain
	if (root === '@') {
		chain.shift()
	} else {
		root = '{}' // by default
	}
	const data = storage[root]

	const value = get(data, chain)

	if (settings.valid(value)) {
		return value
	} else {
		const error = new Error(`object-placeholder: undefined value by path '${path}'`)
		const result = settings.error({
			template: sample,
			data,
			value,
			path,
			error,
		})
		if (result instanceof Error) throw result
		return result
	}
}

/**
 * Convert string path to an array of keys
 * @param  {String} path The path
 * @return {Array}       The path array
 */
function pathToChain (path) {
	return path
		.replace(/\[([^\]]+)\]/g, '.$1') // convert bracket [] notation to dot notation
		.split('.')
		.map(k => isNaN(+k) ? k : +k) // map numbers
}

/**
 * Get an object value from a specific path
 * @param  {Object}       data  The object
 * @param  {Array}        path  The path
 * @return {*}                  The value
 */
function get (data, path) {

	// Cache the current object
	let current = data

	// For each item in the path, dig into the object
	for (let i = 0; i < path.length; i++) {
		// update the current value
		current = current[path[i]]
		if (current == null) {
			return current
		}
	}

	return current
}
