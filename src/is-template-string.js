module.exports = isTemplateString

/**
 * Figure out if the string is a template
 * @param  {String}  template  The string
 * @return {Boolean}
 */
function isTemplateString (template) {
	return (typeof template === 'string' && template.includes('{{'))
}
