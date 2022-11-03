const test = require('ava')
const placeholder = require('../src/object-placeholder.js')

test('placeholder: String',
  testObjectPlaceholder,
  {
    template: '{{greeting}}, {{name}}! It is currently. {{not.exist}} You are {{details.mood}} to eat {{details.food}}. (<em>{{}} <~~ to make sure empty braces are ignored</em>)',
    data: {
      greeting: 'Hello',
      name: 'World',
      details: {
        mood: 'happy',
        food: 'a turkey sandwich'
      }
    },
    options: {
      nested: false,
    }
  },
  'Hello, World! It is currently. {{not.exist}} You are happy to eat a turkey sandwich. (<em>{{}} <~~ to make sure empty braces are ignored</em>)',
)

test('placeholder: MultiString',
  testObjectPlaceholder,
  {
    template: `
    service: {{service.id}}
    displayName: '{{platform.id}} ({{environment.shortName}}): {{service.id}} {{role.name}}'
    serviceType: Integration Service
    appConfigurationId: {{service.id}}
    `,
    data: {
      service: { id: 'SOME_IT_SERVICE' },
      platform: { id: 'SOME_IT_SERVICE' },
      role: { name: 'APPMANAGER' },
      environment: { shortName: 'DEV' },
    },
  },
  `
    service: SOME_IT_SERVICE
    displayName: 'SOME_IT_SERVICE (DEV): SOME_IT_SERVICE APPMANAGER'
    serviceType: Integration Service
    appConfigurationId: SOME_IT_SERVICE
    `
)


test('placeholder: Object',
  testObjectPlaceholder,
  {
    template: {
      service: '{{service.id}}',
      displayName: '{{platform.id}} ({{environment.shortName}}): {{service.id}} {{role.name}}',
      serviceType: 'Integration Service',
      appConfigurationId: '{{service.id}}',
      members: '&{{appdata.members}}',
      isExternal: '&{{appdata.isExternal}}',
    },
    data: {
      service: { id: 'SOME_IT_SERVICE' },
      platform: { id: 'SOME_IT_SERVICE' },
      role: { name: 'APPMANAGER' },
      environment: { shortName: 'DEV' },
      appdata: {
        members: [
          { id: 'user1', email: 'user1@test.com' },
          { id: 'user2', email: 'user2@test.com' },
          { id: 'user3', email: 'user3@test.com' },
        ],
        isExternal: false,
      },
    },
  },
  {
    service: 'SOME_IT_SERVICE',
    displayName: 'SOME_IT_SERVICE (DEV): SOME_IT_SERVICE APPMANAGER',
    serviceType: 'Integration Service',
    isExternal: false,
    appConfigurationId: 'SOME_IT_SERVICE',
    members: [
      { id: 'user1', email: 'user1@test.com' },
      { id: 'user2', email: 'user2@test.com' },
      { id: 'user3', email: 'user3@test.com' },
    ]
  }
)

test('placeholder: Array',
  testObjectPlaceholder,
  {
    template: {
      list: [
        { service: '{{service.id}}' },
        { displayName: '{{platform.id}} ({{environment.shortName}}): {{service.id}} {{role.name}}' },
        { serviceType: 'Integration Service' },
        { appConfigurationId: '{{service.id}}' },
        { members: '&{{appdata.members}}' },
        { isExternal: '&{{appdata.isExternal}}' },
      ],
    },
    data: {
      service: { id: 'SOME_IT_SERVICE' },
      platform: { id: 'SOME_IT_SERVICE' },
      role: { name: 'APPMANAGER' },
      environment: { shortName: 'DEV' },
      appdata: {
        members: [
          { id: 'user1', email: 'user1@test.com' },
          { id: 'user2', email: 'user2@test.com' },
          { id: 'user3', email: 'user3@test.com' },
        ],
        isExternal: false,
      },
    },
  },
  { 
    list: [
      { service: 'SOME_IT_SERVICE' },
      { displayName: 'SOME_IT_SERVICE (DEV): SOME_IT_SERVICE APPMANAGER' },
      { serviceType: 'Integration Service' },
      { appConfigurationId: 'SOME_IT_SERVICE' },
      { members:
        [
          { id: 'user1', email: 'user1@test.com' },
          { id: 'user2', email: 'user2@test.com' },
          { id: 'user3', email: 'user3@test.com' },
        ] 
      },
      { isExternal: false },
    ],
  }
)

test('placeholder: apicall',
  testObjectPlaceholder,
  {
    template: {
      url: 'https://test.com/api/some.{{service.id}}-action',
      method: 'POST',
      payload: {
        id: '{{service.id}}',
        environment: 'dev',
        domain: '{{platform.storage.domain}}',
        CEO: '{{service.CEO.email}}',
        CTO: '{{service.CTO.email}}',
        requestor: '{{platform.createdBy.email}}',
        owners: [
          '{{service.CEO.email}}',
          '{{service.CTO.email}}',
          '{{platform.createdBy.email}}',
        ],
      },
      authentication:
      { type: 'basic',
        storage: 'secret' },
    },
    data: {
      platform: { 
        id: 'some',
        environments: [],
        storage: { domain: 'public' },
        createdBy: { id: 'USER3', name: 'user3', email: 'user3@test.com' },
        status: 'active'
      },
      service: { 
        platforms: [],
        uuid: 'some-uuid',
        id: 'SOME_IT_SERVICE',
        name: 'SOME_IT_SERVICE',
        description: 'Description of SOME_IT_SERVICE',
        CEO:
         { id: 'USER1',
           name: 'user1',
           email: 'user1@test.com' },
        CTO:
         { id: 'USER2',
           name: 'user2',
           email: 'user2@test.com' },
        createdBy: { id: 'USER3', name: 'user3', email: 'user3@test.com' },
        status: 'active',
        registeredOn: '',
        manifestPr: '',
        manifestRc: '',
      },
      user: { id: 'USER1', name: '', email: 'user1@test.com' }
    },
  },
  {
    url: 'https://test.com/api/some.SOME_IT_SERVICE-action',
    method: 'POST',
    payload: { 
      id: 'SOME_IT_SERVICE',
      environment: 'dev',
      domain: 'public',
      CEO: 'user1@test.com',
      CTO: 'user2@test.com',
      requestor: 'user3@test.com',
      owners: [
        'user1@test.com',
        'user2@test.com',
        'user3@test.com',
      ],
    },
    authentication:
    { type: 'basic',
      storage: 'secret' },
  }
)

test('placeholder: List',
  testObjectPlaceholder,
  {
    template: {
      title: '{{ service.id }}',
      emails: [
        '@{{ service.members | member }}',
        '{{ @.member.email }}',
      ],
      users: '&{{ service.members }}',
    },
    data: {
      service: {
        id: 'SOME_IT_SERVICE',
        members: [
          { id: 'user1', email: 'user1@test.com' },
          { id: 'user2', email: 'user2@test.com' },
          { id: 'user3', email: 'user3@test.com' },
        ],
      },
    },
  },
  { 
    title: 'SOME_IT_SERVICE',
    emails: [
      'user1@test.com',
      'user2@test.com',
      'user3@test.com',
    ],
    users: [
      { id: 'user1', email: 'user1@test.com' },
      { id: 'user2', email: 'user2@test.com' },
      { id: 'user3', email: 'user3@test.com' },
    ],
  }
)

test('placeholder: Number',
  testObjectPlaceholderWithError,
  {
    template: 6546546546,
    data: {}
  },
  {
    message: 'object-placeholder: please provide a valid string template',
  },
)

test('placeholder: Not template object property',
  testObjectPlaceholder,
  {
    template: { obj: 6546546546 },
    data: {}
  },
  { obj: 6546546546 },
)

// TODO: options.error should manage this case
test('placeholder: Not resolved',
  testObjectPlaceholder,
  {
    template: '{{user.name}}',
    data: {}
  },
  '{{user.name}}'
)


function testObjectPlaceholder(t, input = {}, expected = {}) {
  const { template, data, options } = input
  data.t = t
  const result = placeholder(template, data, options)
  t.deepEqual(result, expected)
}

function testObjectPlaceholderWithError(t, input = {}, expected = {}) {
  const { template, data, options } = input
  t.throws(() => placeholder(template, data, options), expected)
}
