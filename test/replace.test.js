const test = require('ava')
const { caseReplace, caseReplacePartialArgs } = require('./placeholders.case')

const args = {
  template: '{{greeting}}, {{name}}! It is currently. {{ not.exist }} You are {{details.mood}} to eat {{details.food}}.',
  data: {
    greeting: 'Hello',
    name: 'World',
    details: {
      mood: 'happy',
      food: 'a turkey sandwich'
    }
  },
  options: {
    error: false,
  }
}
const result = 'Hello, World! It is currently. {{ not.exist }} You are happy to eat a turkey sandwich.'

test('replace.call: 3 args',
  caseReplace,
  args,
  result,
)

test('replace.call: 2 args without options',
  caseReplace,
  args,
  result,
)

test('replace.currying: -, -, options',
  caseReplacePartialArgs,
  [{ options: args.options }, args],
  result,
)

test('replace.currying: template, -, options',
  caseReplacePartialArgs,
  [{ template: args.template, options: args.options }, { data: args.data }],
  result,
)

test('replace.currying: -, data, options',
  caseReplacePartialArgs,
  [{ data: args.data, options: args.options }, { template: args.template }],
  result,
)

test('replace.currying: template, -, -',
  caseReplacePartialArgs,
  [{ template: args.template }, { data: args.data, options: args.options }],
  result,
)

test('replace.currying: -, data, -',
  caseReplacePartialArgs,
  [{ data: args.data }, { template: args.template, options: args.options }],
  result,
)
