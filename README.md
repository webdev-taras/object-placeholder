# object-placeholder

It's a zero-dependency package that exports function:
```text
placeholder(template, data, options)
```
where:
- `template` - some template (string, object, array)
- `data` - object with values to replace
- `options` - { error: true } by default

This function allows you to substitute ('mustache' like) `{{<template>}}` by values in `<data>` param including all nested properties of object or array template.

## Usage

```javascript
const placeholder = require('object-placeholder')
```

`String` template:
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
// result = 'John Connor, john.connor@test.com, 1985'
```

`Object` template:
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

`Array` template:
```javascript
const template = {
  title: '{{ service.id }}',
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
  emails: [ 'user1@test.com', 'user2@test.com', 'user3@test.com' ],
  users: [
    { id: 'user1', email: 'user1@test.com' },
    { id: 'user2', email: 'user2@test.com' },
    { id: 'user3', email: 'user3@test.com' }
  ]
}
*/
```

## Syntax

1. String value syntax

Returns the value converted to 'string' type
```text
{{property}}
```

2. Reference value syntax

Returns the value of original type
```text
&{{property}}
```

3. Loop syntax

Starts new loop for property of array type
```text
@{{ array | item }}
```

4. Item syntax

Returns the value of current item in a loop 
```text
{{@.item.property}}
```

## Path

Path can also be dot-separated:

```text
{{user.name}} {{user.email}} 
```

In this case `data` parameter should be the object:
```javascript
{
  user: {
    name: 'John Connor',
    email: 'john.connor@test.com'
  }
}
```

## Options

### error

Define how to manage the case when template was not resolved.
If `true` then throw the Error immediately in place where value by specified path was not found.
If `false` then just pass through this case in leave template string as is.

```javascript
options: {
  error: true // by default
}
```

## Install

> Install on Node.JS with [npm](https://www.npmjs.com/)

```bash
$ npm install --save object-placeholder
```

## License

MIT © [Taras Panasyuk](webdev.taras@gmail.com)
