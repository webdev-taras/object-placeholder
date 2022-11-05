const test = require('ava')
const { caseObjectPlaceholder } = require('./placeholders.case')

test.todo('placeholder: undefined')
test.todo('placeholder: null')
test.todo('placeholder: boolean')
test.todo('placeholder: string')
test.todo('placeholder: symbol')
test.todo('placeholder: bigint')

test('placeholder: number',
  caseObjectPlaceholder,
  {
    template: 6546546546,
    data: undefined,
  },
  6546546546,
)

test.todo('placeholder: array')

test('placeholder: object',
  caseObjectPlaceholder,
  {
    template: { obj: 6546546546 },
    data: {}
  },
  { obj: 6546546546 },
)
