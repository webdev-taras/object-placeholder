const test = require('ava')
const { caseObjectPlaceholder } = require('./placeholders.case')

test('placeholder: undefined',
  caseObjectPlaceholder,
  {
    template: undefined,
  },
  undefined,
)

test('placeholder: null',
  caseObjectPlaceholder,
  {
    template: null,
  },
  null,
)

test('placeholder: boolean',
  caseObjectPlaceholder,
  {
    template: true,
  },
  true,
)

test('placeholder: string',
  caseObjectPlaceholder,
  {
    template: 'blablabla',
  },
  'blablabla',
)

test('placeholder: bigint',
  caseObjectPlaceholder,
  {
    template: 1234567890123456789012345678901234567890n,
  },
  1234567890123456789012345678901234567890n,
)

test('placeholder: number',
  caseObjectPlaceholder,
  {
    template: 6546546546,
  },
  6546546546,
)

test('placeholder: array',
  caseObjectPlaceholder,
  {
    template: [1, 2, 3],
  },
  [1, 2, 3],
)

test('placeholder: object',
  caseObjectPlaceholder,
  {
    template: { obj: 6546546546 },
  },
  { obj: 6546546546 },
)
