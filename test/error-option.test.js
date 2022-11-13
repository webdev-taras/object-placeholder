const test = require('ava')
const { caseObjectPlaceholder, caseObjectPlaceholderWithError } = require('./placeholders.case')

const template = {
  name: '{{ service.name }}',
  title: 'Service - {{ service.name }} ({{ service.id }})',
  emails: [
    '@{{ service.members | member }}',
    '{{ @.member.email }}',
  ],
  users: '&{{ service.members }}',
}

test('placeholder.error: false',
  caseObjectPlaceholder,
  {
    template,
    options: { error: false },
  },
  template
)

test('placeholder.error: true',
  caseObjectPlaceholderWithError,
  {
    template,
    options: { error: true },
  },
  {
    message: `object-placeholder: undefined value by path 'service.name'`,
  },
)

// { template, data, value, path, error }
test('placeholder.error: function - replace by default value',
  caseObjectPlaceholder,
  {
    template,
    data: {
      service: { members: [] },
      default: 'SOME DEFAULT VALUE'
    },
    options: {
      error: ({ data }) => data.default
    },
  },
  {
    name: 'SOME DEFAULT VALUE',
    title: 'Service - SOME DEFAULT VALUE (SOME DEFAULT VALUE)',
    emails: [],
    users: [],
  }
)

test('placeholder.error: function - replace by UNKNOWN',
  caseObjectPlaceholder,
  {
    template,
    data: {
      service: { members: [1, 2, 3] },
    },
    options: {
      error: ({ data }) => 'UNKNOWN'
    },
  },
  {
    name: 'UNKNOWN',
    title: 'Service - UNKNOWN (UNKNOWN)',
    emails: ['UNKNOWN', 'UNKNOWN', 'UNKNOWN'],
    users: [1, 2, 3],
  }
)

test('placeholder.error: function - generate custom error',
  caseObjectPlaceholderWithError,
  {
    template,
    options: {
      error: ({ path }) => new Error(`Parse error: can't find value by path '${path}'`)
    },
  },
  {
    message: `Parse error: can't find value by path 'service.name'`,
  },
)
