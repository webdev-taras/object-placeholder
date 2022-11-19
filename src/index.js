// object-placeholder
// * Inspired by Placeholders.JS implemented by Chris Ferdinandi (https://gomakethings.com)

const deepClone = require('./deep-clone')
const isPlainObject = require('./is-plain-object')
const nestedPlaceholder = require('./object-placeholder')

module.exports = placeholder

/**
 * Replaces placeholders with real content
 * @param  {<T>}          template  The template
 * @param  {Object}       data      The object of values to substitute
 * @param  {Object}       options   Some options
 * @return {<T>}                    The output value
 */
function placeholder (template, data = {}, options = {}) {
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
placeholder.replace = replace

const params = ['template', 'data', 'options']
/**
 * Call 'placeholder' with prepared args
 * @param  {Object}       args    The object of args to pass
 * @return {<T>}                  The result
 */
function replace(args) {
	if (!isPlainObject(args))
		throw new TypeError(`replace: the argument type should be 'object'`)
	
	const keys = Object.keys(args)
		.filter(key => params.includes(key))

	if (keys.length === 0) {
		throw new TypeError(`replace: at least one property in argument object should be specified`)
	} else if (keys.length === 3 || (keys.length === 2 && !keys.includes('options'))) {
		// call
		const { template, data, options } = args
		return placeholder(template, data, options)
	} else {
		// currying
		const partial = keys.reduce((obj, key) => {
			obj[key] = args[key]
			return obj
		}, {})
		return (input) => {
			if (!isPlainObject(input))
				throw new TypeError(`replace.currying: the argument type should be 'object'`)
			return replace({ ...partial, ...input })
		}
	}
}
