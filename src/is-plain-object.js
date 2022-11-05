module.exports = isPlainObject

/**
 * Figure out if the value is plain object
 * @param  {*}       value The value
 * @return {Boolean}
 */
function isPlainObject (value) {
	if (typeof value !== 'object' || value === null) {
		return false
	}
	const prototype = Object.getPrototypeOf(value)
	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null)
}
