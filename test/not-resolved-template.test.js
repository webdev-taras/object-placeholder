const test = require('ava')
const { caseObjectPlaceholder } = require('./placeholders.case')

test('placeholder.String: not resolved',
  caseObjectPlaceholder,
  {
    template: '{{user.name}}',
    data: {},
    options: {
      error: false,
    }
  },
  '{{user.name}}'
)
test.todo('placeholder.EmptyString: not resolved')
test.todo('placeholder.MultiString: not resolved')
test.todo('placeholder.Object: not resolved')
test.todo('placeholder.Array: not resolved')
test.todo('placeholder.List: not resolved')
