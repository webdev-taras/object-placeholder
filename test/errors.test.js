const test = require('ava')
const {
  caseObjectPlaceholderWithError,
  caseReplaceWithError,
  caseReplacePartialArgsWithError,
} = require('./placeholders.case')

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

test('placeholder.Reference: Path not found',
  caseObjectPlaceholderWithError,
  {
    template: { name: '&{{user.name}}' },
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


test('replace: no arguments at all',
  caseReplaceWithError,
  undefined,
  {
    message: `replace: the argument type should be 'object'`,
  },
)

test('replace: wrong argument type',
  caseReplaceWithError,
  'some template',
  {
    message: `replace: the argument type should be 'object'`,
  },
)

test('replace: empty argument object',
  caseReplaceWithError,
  {},
  {
    message: `replace: at least one property in argument object should be specified`,
  },
)

test('replace.currying: wrong argument type',
  caseReplacePartialArgsWithError,
  [{ options: {} }],
  {
    message: `replace.currying: the argument type should be 'object'`,
  },
)
