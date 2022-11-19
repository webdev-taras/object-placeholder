const { replace } = require('object-placeholder')

const template = '{{user.name}}, {{user.email}}, {{user.id}}'
const options = { clone: true }

const configured = replace({ template, options })

const result1 = configured({
  data: {
    user: {
      id: 1985,
      name: 'John Connor',
      email: 'john.connor@test.com'
    }
  }
})
console.log(result1)

const result2 = configured({
  data: {
    user: {
      id: 1965,
      name: 'Sarah Connor',
      email: 'sarah.connor@test.com'
    }
  }
})
console.log(result2)
