module.exports =  [

  //this is the resource for public actions
  { resource: "service:api:system:public" },
    
  // site administrator can manage the application tokens
  { resource: "service:api:system:token.list" },
  { resource: "service:api:system:token.create" },
  { resource: "service:api:system:token.delete" },

  // site administrator can manage the application tokens
  { resource: "service:api:system:topic.list" },
  { resource: "service:api:system:topic.create" },
  { resource: "service:api:system:topic.delete" },

  //site administor can change the policies (theese endpoints are not performed yet)
  { resource: "service:api:system:policy.create" },
  { resource: "service:api:system:policy.read" },
  { resource: "service:api:system:policy.update" },
  { resource: "service:api:system:policy.delete" },

  //site administor can update and read the api configuration (theese endpoints are not performed yet)
  { resource: "service:api:system:configuration.read" },
  { resource: "service:api:system:configuration.update" },

  // client actions
  { resource: "client:web:system:webclient.applications.show" },
  { resource: "client:web:system:webclient.topics.show" },
  { resource: "client:web:system:webclient.logout.show" },

]