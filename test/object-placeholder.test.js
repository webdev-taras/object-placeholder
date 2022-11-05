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
    displayName: '{{platform.id}} ({{environment.name}}): {{service.name}} {{role.name}}'
    serviceType: Integration Service
    appConfigurationId: {{platform.id}}
    active: {{service.active}}
    admin: {{emails[0]}}
    service: {{service}}
    emails: {{emails}}
    `,
    data: {
      service: { id: 123456789, name: 'Some IT Service', active: true },
      platform: { id: 'SOME_IT_SERVICE' },
      role: { name: 'APPMANAGER' },
      environment: { name: 'DEV' },
      emails: [
        'user1@test.com',
        'user2@test.com',
        'user3@test.com',
      ],
    },
  },
  `
    serviceId: 123456789
    displayName: 'SOME_IT_SERVICE (DEV): Some IT Service APPMANAGER'
    serviceType: Integration Service
    appConfigurationId: SOME_IT_SERVICE
    active: true
    admin: user1@test.com
    service: {"id":123456789,"name":"Some IT Service","active":true}
    emails: ["user1@test.com","user2@test.com","user3@test.com"]
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
      mailto: '{{info.members.0.email}}',
      members: '&{{info.members}}',
      isExternal: '&{{info.isExternal}}',
    },
    data: {
      service: { id: 'SOME_IT_SERVICE' },
      platform: { id: 'SOME_IT_SERVICE' },
      role: { name: 'APPMANAGER' },
      environment: { name: 'DEV' },
      info: {
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
    mailto: 'user1@test.com',
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
        { members: '&{{info.members}}' },
        { isExternal: '&{{info.isExternal}}' },
      ],
    },
    data: {
      service: { id: 'SOME_IT_SERVICE' },
      platform: { id: 'SOME_IT_SERVICE' },
      role: { name: 'APPMANAGER' },
      environment: { name: 'DEV' },
      info: {
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
      users: [
        '@{{ service.members | member }}',
        {
          name: '{{ @.member.id }}',
          email: '{{ @.member.email }}',
        },
      ],
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
      { name: 'user1', email: 'user1@test.com' },
      { name: 'user2', email: 'user2@test.com' },
      { name: 'user3', email: 'user3@test.com' },
    ],
  }
)
