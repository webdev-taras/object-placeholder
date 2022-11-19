# object-placeholder

It's a zero-dependency package that exports default function:
```text
placeholder(<template>, <data>, <options>)
```
and function with named params:
```text
placeholder.replace({ template, data, options })
```
where:
- `template` - some template ( [string](#string-template), [object](#object-template), [array](#array-template) )
- `data` - object with values to replace
- `options` - { [error, clone, stringify](#options) }

This function allows you to substitute ['mustache' like](#syntax) `{{<template>}}` by values in `<data>` param including all nested properties of object or array template.

## Usage

```javascript
const placeholder = require('object-placeholder')
// or
const { replace } = require('object-placeholder')
```

### `String` template:
```javascript
const template = '{{user.name}}, {{user.email}}, {{user.id}}'
const data = {
  user: {
    id: 1985,
    name: 'John Connor',
    email: 'john.connor@test.com'
  }
}

const result = placeholder(template, data)
// or
const result = replace({ template, data })
// result = 'John Connor, john.connor@test.com, 1985'
```

### `Object` template:
```javascript
const template = {
  target: {
    uuid: '&{{user.id}}',
    user: '{{user.name}}',
  },
  mailto: 'mailto:{{user.email}}',
}
const data = {
  user: {
    id: 1985,
    name: 'John Connor',
    email: 'john.connor@test.com'
  }
}
const result = placeholder(template, data)
/*
result = {
  target: { uuid: 1985, user: 'John Connor' },
  mailto: 'mailto:john.connor@test.com'
}
*/
```

### `Array` template:
```javascript
const template = {
  title: '{{ service.id }}',
  admin: '{{ service.members[0].id }}', // get first element of 'service.members'
  mailto: '{{service.members.0.email}}',
  emails: [
    '@{{ service.members | member }}', // for each item of 'service.members'
    '{{ @.member.email }}', // '@.member' - current item
  ],
  users: '&{{ service.members }}',
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
const result = placeholder(template, data)
/*
result = {
  title: 'SOME_IT_SERVICE',
  admin: 'user1',
  mailto: 'user1@test.com',
  emails: [ 'user1@test.com', 'user2@test.com', 'user3@test.com' ],
  users: [
    { id: 'user1', email: 'user1@test.com' },
    { id: 'user2', email: 'user2@test.com' },
    { id: 'user3', email: 'user3@test.com' }
  ]
}
*/
```

[All examples](examples).

## Syntax

### 1. String value syntax

Returns the value converted to 'string' type
```text
{{property}}
```
Path can also be dot-separated:
```text
{{user.name}} {{user.email}} 
```

In this case `data` parameter should be the object:
```javascript
{
  property: 'blablabla',
  user: {
    name: 'John Connor',
    email: 'john.connor@test.com'
  }
}
```

### 2. Reference value syntax

Returns the value of original type
```text
&{{property}}
```

### 3. Loop syntax

Starts new loop for property of array type
```text
@{{ array | item }}
```

### 4. Item syntax

Returns the value of current item in a loop 
```text
{{@.item.property}}
```

## Options

By default
```javascript
options: {
  error: true,
  clone: true,
  stringify: true,
}
```

### `error`

Define how to manage the case when template was not resolved.\
If `true` then throw the Error immediately in place where value by specified path was not found.\
If `false` then just pass through this case and leave template string as is.\
If custom `function` passed then it will be used as error handler function.\
For more details see [test examples](test/error-option.test.js).

### `clone`

Clone the output value or not.\
If `true` then all properties of output object will be cloned.\
If `false` then 'object' type properties will refer to input data object properties.\
If custom `function` passed then it will be used as clone function.\
For more details see [test examples](test/clone-option.test.js).

### `stringify`

Stringify the value of non 'string' type.\
If `true` then `JSON.stringify()` will be used.\
If `false` then `value.toString()` will be used.\
If custom `function` passed then it will be used as stringify function.\
For more details see [test examples](test/stringify-option.test.js).

## Partial application

You can use partial application for `replace` function parameters in order to produce another function of smaller arguments i.e binding values to one or more of those arguments. For example:
```javascript
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
// result1 = 'John Connor, john.connor@test.com, 1985'

const result2 = configured({
  data: {
    user: {
      id: 1965,
      name: 'Sarah Connor',
      email: 'sarah.connor@test.com'
    }
  }
})
// result2 = 'Sarah Connor, sarah.connor@test.com, 1965'

```

## Install

> Install on Node.JS with [npm](https://www.npmjs.com/)

```bash
$ npm install --save object-placeholder
```

## License

MIT © [Taras Panasyuk](webdev.taras@gmail.com)
