import { PolicyTypes } from './policy_types'

const TOKEN_RESOURCE_NAME = 'token'
const USER_RESOURCE_NAME = 'user'
const TOPIC_RESOURCE_NAME = 'topic'

// export const createUser = {
//   resource: `service:api:system:${USER_RESOURCE_NAME}.list`,
//   name: `${USER_RESOURCE_NAME}.create`,
//   slug: `Create ${USER_RESOURCE_NAME}`,
//   type: DefaultPolicyService.types.default,
//   description: `Policy for create ${USER_RESOURCE_NAME}.`,
//   extends: [], depends: [],
//   actions: [
//     { path: `POST/api/v1/users/`, scopes: [`createUser`] }
//   ]
// };

// export const userRead = {
//   resource: "service:api:system:user.read",
//   name: "user.read",
//   slug: "Read Users",
//   type: DefaultPolicyService.types.default,
//   description: "Policy for Read. This will read only api user. If you want to know more information about some user in moodle, pelase go to Moodle administration",
//   extends: [], depends: [],
//   actions: [
//     { path: "GET/api/v1/users/:id?", scopes: ["readUser"] }
//   ]
// };

export const listStudents = {
  resource: `service:api:system:${USER_RESOURCE_NAME}.student.list`,
  name: `${USER_RESOURCE_NAME}.list`,
  slug: `List ${USER_RESOURCE_NAME}s`,
  type: PolicyTypes.default,
  description: `Policy for list the teacher students ${USER_RESOURCE_NAME}`,
  extends: [], depends: [],
  actions: [
    { path: `GET/api/v1/${USER_RESOURCE_NAME}s/students`, scopes: [`listStudents`] }
  ]
};

export const listToken = {
  resource: `service:api:system:${TOKEN_RESOURCE_NAME}.list`,
  name: `${TOKEN_RESOURCE_NAME}.list`,
  slug: `List ${TOKEN_RESOURCE_NAME}s`,
  type: PolicyTypes.default,
  description: `Policy for list an application ${TOKEN_RESOURCE_NAME}`,
  extends: [], depends: [],
  actions: [
    { path: `GET/api/v1/${TOKEN_RESOURCE_NAME}/:id?`, scopes: [`listToken`] }
  ]
};

export const createToken = {
  resource: `service:api:system:${TOKEN_RESOURCE_NAME}.create`,
  name: `${TOKEN_RESOURCE_NAME}.create`,
  slug: `Create ${TOKEN_RESOURCE_NAME}`,
  type: PolicyTypes.default,
  description: `Policy for create an application ${TOKEN_RESOURCE_NAME}`,
  extends: [], depends: [],
  actions: [
    { path: `POST/api/v1/${TOKEN_RESOURCE_NAME}/`, scopes: [`createToken`] }
  ]
};

export const deleteToken = {
  resource: `service:api:system:${TOKEN_RESOURCE_NAME}.delete`,
  name: `${TOKEN_RESOURCE_NAME}.delete`,
  slug: `Delete ${TOKEN_RESOURCE_NAME}`,
  type: PolicyTypes.default,
  description: `Policy for delete an application ${TOKEN_RESOURCE_NAME}`,
  extends: [], depends: [],
  actions: [
    { path: `DELETE/api/v1/${TOKEN_RESOURCE_NAME}/:id`, scopes: [`deleteToken`] }
  ]
};


export const createTopic = {
  resource: `service:api:system:${TOPIC_RESOURCE_NAME}.create`,
  name: `${TOPIC_RESOURCE_NAME}.create`,
  slug: `Create ${TOPIC_RESOURCE_NAME}`,
  type: PolicyTypes.default,
  description: `Policy for create a ${TOPIC_RESOURCE_NAME}`,
  extends: [], depends: [],
  actions: [
    { path: `POST/api/v1/${TOPIC_RESOURCE_NAME}/`, scopes: [`createTopic`] }
  ]
}
export const deleteTopic = {
  resource: `service:api:system:${TOPIC_RESOURCE_NAME}.delete`,
  name: `${TOPIC_RESOURCE_NAME}.delete`,
  slug: `Delete ${TOPIC_RESOURCE_NAME}`,
  type: PolicyTypes.default,
  description: `Policy for delete a ${TOPIC_RESOURCE_NAME}`,
  extends: [], depends: [],
  actions: [
    { path: `DELETE/api/v1/${TOPIC_RESOURCE_NAME}/:id`, scopes: [`deleteTopic`] }
  ]
}
export const listTopic = {
  resource: `service:api:system:${TOPIC_RESOURCE_NAME}.list`,
  name: `${TOPIC_RESOURCE_NAME}.list`,
  slug: `List ${TOPIC_RESOURCE_NAME}`,
  type: PolicyTypes.default,
  description: `Policy for list the ${TOPIC_RESOURCE_NAME}`,
  extends: [], depends: [],
  actions: [
    { path: `GET/api/v1/${TOPIC_RESOURCE_NAME}/:id?`, scopes: [`listTopic`] }
  ]
}
