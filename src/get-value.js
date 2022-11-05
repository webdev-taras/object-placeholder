module.exports = getValue

/**
 * Get a value from storage by specific path 
 * @param  {Object}       storage   The values storage
 * @param  {String}       path      The path
 * @param  {Boolean}      error     Throw the error or not
 * @param  {Boolean}      stringify Converte to string the output value 
 * @return {*}                      The output value
 */
 function getValue (storage, path, error, stringify = true) {
	
	// Get the path as an array
	const chain = pathToChain(path)

	let [ root ] = chain
	if (root === '@') {
		chain.shift()
	} else {
		root = '{}' // by default
	}
	const obj = storage[root]

	const data = get(obj, chain, error)

	const result = (stringify && typeof data === 'object')
		? JSON.stringify(data)
		: data

	return result
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
 * @param  {Object}       obj   The object
 * @param  {Array}        path  The path
 * @param  {Boolean}      error Throw the error or not
 * @return {*}                  The value
 */
function get (obj, path, error) {

	// Cache the current object
	let current = obj

	// For each item in the path, dig into the object
	for (let i = 0; i < path.length; i++) {
		// update the current value
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
