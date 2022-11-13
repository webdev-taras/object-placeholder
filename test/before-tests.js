const test = require('ava')

test.before(t => {
  t.context.placeholder = require('../src/index')
})
