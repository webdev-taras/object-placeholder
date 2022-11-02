module.exports = value => {
	if (typeof value !== 'object' || value === null) {
		return false
	}
	const prototype = Object.getPrototypeOf(value)
	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null)
}
