// object-placeholder
// * Inspired by Placeholders.JS implemented by Chris Ferdinandi (https://gomakethings.com)

const deepClone = require('./deep-clone')
const nestedPlaceholder = require('./object-placeholder')

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
		stringify = true, // Stringify the value of non 'string' type
	} = options
	const settings = {
		valid: value => value != null,
		// function error({ template, data, value, path, error })
		error: (typeof error === 'function')
			? error
			: (error) ? ({ error }) => error : ({ template }) => template,
		// function clone(value)
		clone: (typeof clone === 'function')
			? clone
			: (clone) ? deepClone : value => value,
		// function stringify(value)
		stringify: (typeof stringify === 'function')
		  ? stringify
			: (stringify)? JSON.stringify : value => value.toString()
	}
	const storage = {
		'{}': data, // input data
		'@': {}, // loop data
	}
	return nestedPlaceholder(template, storage, settings)
}
