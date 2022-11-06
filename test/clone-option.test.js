const test = require('ava')

const template = {
  title: '{{ service.id }}',
  users: [
    '@{{ service.members | member }}',
    '&{{ @.member }}',
  ],
  members: '&{{ service.members }}',
  admin: '&{{ service.members[0] }}',
  origin: '&{{ service }}',
}
const data = {
  service: {
    id: 'SOME_IT_SERVICE',
    members: [
      { id: 'user1', email: 'user1@test.com' },
      { id: 'user2', email: 'user2@test.com' },
      { id: 'user3', email: 'user3@test.com' },
    ],
  },
}
const output = { 
  title: data.service.id,
  users: data.service.members,
  members: data.service.members,
  admin: data.service.members[0],
  origin: data.service,
}

test('placeholder.DeepClone: options.clone = true',
  casePlaceholderDeepClone,
  { template, data },
  output
)

test('placeholder.DeepClone: options.clone = false',
  casePlaceholderDeepCloneWithout,
  { template, data },
  output
)

function casePlaceholderDeepClone(t, input = {}, expected) {
  const { placeholder } = t.context
  const { template, data } = input
  const result = placeholder(template, data, { clone: true })
  t.is(result.title, expected.title)
  t.not(result.users, expected.users)
  result.users.forEach((_, i) =>
    t.not(result.users[i], expected.users[i])
  )
  t.not(result.members, expected.members)
  result.members.forEach((_, i) =>
    t.not(result.users[i], expected.members[i])
  )
  t.not(result.admin, expected.admin)
  t.not(result.origin, expected.origin)
  t.deepEqual(result, expected)
}

function casePlaceholderDeepCloneWithout(t, input = {}, expected) {
  const { placeholder } = t.context
  const { template, data } = input
  const result = placeholder(template, data, { clone: false })
  t.is(result.title, expected.title)
  t.not(result.users, expected.users)
  result.users.forEach((_, i) =>
    t.is(result.users[i], expected.users[i])
  )
  t.is(result.members, expected.members)
  t.is(result.admin, expected.admin)
  t.is(result.origin, expected.origin)
  t.deepEqual(result, expected)
}
