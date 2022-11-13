const test = require('ava')
const { caseObjectPlaceholder } = require('./placeholders.case')

test('placeholder.String: not resolved',
  caseObjectPlaceholder,
  {
    template: '{{user.name}}',
    options: { error: false }
  },
  '{{user.name}}'
)

test('placeholder.EmptyPath: not resolved',
  caseObjectPlaceholder,
  {
    template: '{{}}',
    options: { error: false }
  },
  '{{}}'
)

test('placeholder.Object: not resolved',
  caseObjectPlaceholder,
  {
    template: {
      name: '{{user.name}}',
      info: '{{}}',
    },
    options: { error: false }
  },
  {
    name: '{{user.name}}',
    info: '{{}}',
  }
)

test('placeholder.Array: not resolved',
  caseObjectPlaceholder,
  {
    template: ['{{}}'],
    options: { error: false }
  },
  ['{{}}']
)

test('placeholder.List: not resolved',
  caseObjectPlaceholder,
  {
    template: [
      '@{{ members | member }}',
      '{{ @.member.name }}',
    ],
    data: {
      members: [
        { id: 'user1', email: 'user1@test.com' },
        { id: 'user2', email: 'user2@test.com' },
        { id: 'user3', email: 'user3@test.com' },
      ],
    },
    options: { error: false }
  },
  [
    '{{ @.member.name }}',
    '{{ @.member.name }}',
    '{{ @.member.name }}',
  ]
)
