module.exports =  [
  //this is the resource for public actions
  { resource: "service:api:system:public" },
  //site administor can change the users,
  { resource: "service:api:system:user.read" },
  // site administrator can manage the application tokens
  { resource: "service:api:system:token.list" },
  { resource: "service:api:system:token.create" },
  { resource: "service:api:system:token.delete" },
  // site administrator can manage the application tokens
  { resource: "service:api:system:topic.list" },
  { resource: "service:api:system:topic.create" },
  { resource: "service:api:system:topic.delete" },
  //site administor can change the policies
  { resource: "service:api:system:policy.create" },
  { resource: "service:api:system:policy.read" },
  { resource: "service:api:system:policy.update" },
  { resource: "service:api:system:policy.delete" },
  //site administor can update and read the api configuration
  { resource: "service:api:system:configuration.read" },
  { resource: "service:api:system:configuration.update" },
  { resource: "service:api:system:user.token" },

]