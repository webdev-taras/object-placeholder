const test = require('ava')
const { caseObjectPlaceholderWithError } = require('./placeholders.case')

test('placeholder.String: Path not found',
  caseObjectPlaceholderWithError,
  {
    template: '{{user.name}}',
    data: {},
    options: {
      error: true,
    }
  },
  {
    message: `object-placeholder: undefined value by path 'user.name'`,
  },
)
test.todo('placeholder.MultiString: Path not found')

test('placeholder.Object: Path not found',
  caseObjectPlaceholderWithError,
  {
    template: { name: '{{user.name}}' },
    data: {},
    options: {
      error: true,
    }
  },
  {
    message: `object-placeholder: undefined value by path 'user.name'`,
  },
)

test('placeholder.Array: Path not found',
  caseObjectPlaceholderWithError,
  {
    template: ['{{user.name}}'],
    data: {},
    options: {
      error: true,
    }
  },
  {
    message: `object-placeholder: undefined value by path 'user.name'`,
  },
)

test('placeholder.List: Path not found',
  caseObjectPlaceholderWithError,
  {
    template: {
      emails: [
        '@{{ service.members | member }}',
        '{{ @.member.email }}',
      ],
    },
    data: {
      service: {
        members: 'SOME_IT_SERVICE',
      },
    },
  },
  {
    message: `object-placeholder: path 'service.members' should point to array value`,
  },
)
