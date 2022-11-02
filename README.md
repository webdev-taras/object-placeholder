# object-placeholder

It's a zero-dependency package that exports function:
```text
placeholder(template, data, options)
```
where:
- `template` - some template (string, object, array)
- `data` - object with values to replace
- `options` - { nested: true } by default

This function allows you to substitute ('mustache' like) `{{<templates>}}` by `values`.

## Usage

```javascript
const placeholder = require('object-placeholder')
```

String template:
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

Object template:
```javascript
const template = {
  target: '{{user.name}}',
  mailto: 'mailto:{{user.email}}',
  uuid: '&{{user.id}}',
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
  target: 'John Connor',
  mailto: 'mailto:john.connor@test.com'
  uuid: 1985,
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

### nested

Allows to process all nested properties in object.

```javascript
options: {
  nested: true // by default
}
```

## Install

> Install on Node.JS with [npm](https://www.npmjs.com/)

```bash
$ npm install --save object-placeholder
```

## License

MIT © [Taras Panasyuk](webdev.taras@gmail.com)
