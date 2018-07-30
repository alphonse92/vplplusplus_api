module.exports = {
	siteadministrator:[
		"service:api:system:*:*",
		"resource:api:system:user:create",
		//site administor can change the users
		"resource:api:system:user:create",
		"resource:api:system:user:read",
		"resource:api:system:user:update",
		"resource:api:system:user:delete",
		//site administor can change the policies
		"resource:api:system:policy:create",
		"resource:api:system:policy:read",
		"resource:api:system:policy:update",
		"resource:api:system:policy:delete",
		//site administor can update and read the api configuration
		"resource:api:system:configuration:read",
		"resource:api:system:configuration:update",
	],
	manager:[
		"service:api:system:*:*",
	],
	coursecreator:[
		"service:api:system:*:*",
	],
	editingteacher:[
		"service:api:system:*:*",
	],
	teacher:[
		"service:api:system:*:*",
	],
	student:[
		"service:api:system:*:*",
	],
	guest:[
		"service:api:system:*:*",
	],
	user:[
		"service:api:system:*:*",
	],
	frontpage:[
		"service:api:system:*:*",
	],
};