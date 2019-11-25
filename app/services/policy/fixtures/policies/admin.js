import { PolicyTypes } from './policy_types'

const TOKEN_RESOURCE_NAME = 'token'
const USER_RESOURCE_NAME = 'user'
const TOPIC_RESOURCE_NAME = 'topic'


export const listStudents = {
  resource: `service:api:system:${USER_RESOURCE_NAME}.student.list`,
  name: `${USER_RESOURCE_NAME}.list`,
  slug: `List ${USER_RESOURCE_NAME}s`,
  type: PolicyTypes.default,
  description: `Policy for list the teacher students ${USER_RESOURCE_NAME}`,
  extends: [], depends: [],
  actions: [
    { path: `GET/${Config.web.public}/v1/${USER_RESOURCE_NAME}s/students`, scopes: [`listStudents`] }
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
    { path: `GET/${Config.web.public}/v1/${TOKEN_RESOURCE_NAME}/:id?`, scopes: [`listToken`] }
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
    { path: `POST/${Config.web.public}/v1/${TOKEN_RESOURCE_NAME}/`, scopes: [`createToken`] }
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
    { path: `DELETE/${Config.web.public}/v1/${TOKEN_RESOURCE_NAME}/:id`, scopes: [`deleteToken`] }
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
    { path: `POST/${Config.web.public}/v1/${TOPIC_RESOURCE_NAME}/`, scopes: [`createTopic`] }
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
    { path: `DELETE/${Config.web.public}/v1/${TOPIC_RESOURCE_NAME}/:id`, scopes: [`deleteTopic`] }
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
    { path: `GET/${Config.web.public}/v1/${TOPIC_RESOURCE_NAME}/list/:id?`, scopes: [`listTopic`] }
  ]
}
