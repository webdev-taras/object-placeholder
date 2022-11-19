module.exports = {
  caseObjectPlaceholder,
  caseObjectPlaceholderWithError,
  caseReplace,
  caseReplaceWithError,
  caseReplacePartialArgs,
  caseReplacePartialArgsWithError,
}

function caseObjectPlaceholder(t, input = {}, expected) {
  const { placeholder } = t.context
  const { template, data, options } = input
  const result = placeholder(template, data, options)
  t.deepEqual(result, expected)
}

function caseObjectPlaceholderWithError(t, input = {}, expected) {
  const { placeholder } = t.context
  const { template, data, options } = input
  t.throws(() => placeholder(template, data, options), expected)
}

function caseReplace(t, input, expected) {
  const { placeholder: { replace } } = t.context
  const result = replace(input)
  t.deepEqual(result, expected)
}
function caseReplaceWithError(t, input, expected) {
  const { placeholder: { replace } } = t.context
  t.throws(() => replace(input), expected)
}

function caseReplacePartialArgs(t, input, expected) {
  const { placeholder: { replace } } = t.context
  const [ first, second ] = input
  const func = replace(first)
  t.is(typeof func, 'function')
  const result = func(second)
  t.deepEqual(result, expected)
}

function caseReplacePartialArgsWithError(t, input, expected) {
  const { placeholder: { replace } } = t.context
  const [ first, second ] = input
  const func = replace(first)
  t.is(typeof func, 'function')
  t.throws(() => func(second), expected)
}
