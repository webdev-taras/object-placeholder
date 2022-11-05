const test = require('ava')
const { caseObjectPlaceholder } = require('./placeholders.case')

test('placeholder.String: simple',
  caseObjectPlaceholder,
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
      error: false,
    }
  },
  'Hello, World! It is currently. {{not.exist}} You are happy to eat a turkey sandwich. (<em>{{}} <~~ to make sure empty braces are ignored</em>)',
)

test('placeholder.MultiString: service',
  caseObjectPlaceholder,
  {
    template: `
    serviceId: {{service.id}}
    displayName: '{{platform.id}} ({{environment.name}}): {{service.id}} {{role.name}}'
    serviceType: Integration Service
    appConfigurationId: {{service.id}}
    service: {{service}}
    `,
    data: {
      service: { id: 'SOME_IT_SERVICE', name: 'Some IT Service' },
      platform: { id: 'SOME_IT_SERVICE' },
      role: { name: 'APPMANAGER' },
      environment: { name: 'DEV' },
    },
  },
  `
    serviceId: SOME_IT_SERVICE
    displayName: 'SOME_IT_SERVICE (DEV): SOME_IT_SERVICE APPMANAGER'
    serviceType: Integration Service
    appConfigurationId: SOME_IT_SERVICE
    service: {"id":"SOME_IT_SERVICE","name":"Some IT Service"}
    `
)

test('placeholder.Object: service',
  caseObjectPlaceholder,
  {
    template: {
      service: '{{service.id}}',
      displayName: '{{platform.id}} ({{environment.name}}): {{service.id}} {{role.name}}',
      serviceType: 'Integration Service',
      appConfigurationId: '{{service.id}}',
      members: '&{{appdata.members}}',
      isExternal: '&{{appdata.isExternal}}',
    },
    data: {
      service: { id: 'SOME_IT_SERVICE' },
      platform: { id: 'SOME_IT_SERVICE' },
      role: { name: 'APPMANAGER' },
      environment: { name: 'DEV' },
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

test('placeholder.Object: apicall',
  caseObjectPlaceholder,
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

test('placeholder.Array: service',
  caseObjectPlaceholder,
  {
    template: {
      list: [
        { service: '{{service.id}}' },
        { displayName: '{{platform.id}} ({{environment.name}}): {{service.id}} {{role.name}}' },
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
      environment: { name: 'DEV' },
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

test('placeholder.List: service',
  caseObjectPlaceholder,
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
