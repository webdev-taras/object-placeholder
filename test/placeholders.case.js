module.exports = {
  caseObjectPlaceholder,
  caseObjectPlaceholderWithError,
}

function caseObjectPlaceholder(t, input = {}, expected) {
  const { placeholder } = t.context
  const { template, data, options } = input
  const result = placeholder(template, data, options)
  t.log(result)
  t.deepEqual(result, expected)
}

function caseObjectPlaceholderWithError(t, input = {}, expected) {
  const { placeholder } = t.context
  const { template, data, options } = input
  t.throws(() => placeholder(template, data, options), expected)
}
