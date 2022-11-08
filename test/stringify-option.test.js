const test = require('ava')
const { caseObjectPlaceholder } = require('./placeholders.case')

test('placeholder.stringify: false',
  caseObjectPlaceholder,
  {
    template: '{{list}}',
    options: {
      stringify: false,
    },
    data: {
      list: [1, 2, 3],
    }
  },
  '1,2,3',
)

test('placeholder.stringify: true',
  caseObjectPlaceholder,
  {
    template: '{{list}}',
    options: {
      stringify: true,
    },
    data: {
      list: [1, 2, 3],
    }
  },
  '[1,2,3]',
)

test('placeholder.stringify: function',
  caseObjectPlaceholder,
  {
    template: '{{list}}',
    options: {
      stringify: value =>
        (Array.isArray(value))
          ? value.join(' ')
          : value.toString(),
    },
    data: {
      list: [1, 2, 3],
    }
  },
  '1 2 3',
)
