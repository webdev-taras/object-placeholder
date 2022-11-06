/**
 * Creates a deep clone of a given value
 * @param  {T} value The value to clone
 * @return {T}
 */
 module.exports = (globalThis.structuredClone)
  ? globalThis.structuredClone
  : (obj) => JSON.parse(JSON.stringify(obj))
