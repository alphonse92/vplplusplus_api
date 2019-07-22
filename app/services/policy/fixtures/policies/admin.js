import { PolicyTypes } from './policy_types'

const TOKEN_RESOURCE_NAME = 'token'
const USER_RESOURCE_NAME = 'user'

// export const createUser = {
//   resource: `service:api:system:${USER_RESOURCE_NAME}.list`,
//   name: `${USER_RESOURCE_NAME}.create`,
//   slug: `Create ${USER_RESOURCE_NAME}`,
//   type: DefaultPolicyService.types.default,
//   description: `Policy to create ${USER_RESOURCE_NAME}.`,
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


export const listToken = {
  resource: `service:api:system:${TOKEN_RESOURCE_NAME}.list`,
  name: `${TOKEN_RESOURCE_NAME}.list`,
  slug: `List ${TOKEN_RESOURCE_NAME}s`,
  type: PolicyTypes.default,
  description: `Policy to list an application ${TOKEN_RESOURCE_NAME}`,
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
  description: `Policy to create an application ${TOKEN_RESOURCE_NAME}`,
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
  description: `Policy to delete an application ${TOKEN_RESOURCE_NAME}`,
  extends: [], depends: [],
  actions: [
    { path: `DELETE/api/v1/${TOKEN_RESOURCE_NAME}/:id`, scopes: [`deleteToken`] }
  ]
};

