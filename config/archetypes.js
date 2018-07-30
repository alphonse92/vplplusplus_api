module.exports = {
	siteadministrator:[
		"service:api:system:all:all",
		"service:api:system:user:create",
		//site administor can change the users
		"service:api:system:user:create",
		"service:api:system:user:read",
		"service:api:system:user:update",
		"service:api:system:user:delete",
		//site administor can change the policies
		"service:api:system:policy:create",
		"service:api:system:policy:read",
		"service:api:system:policy:update",
		"service:api:system:policy:delete",
		//site administor can update and read the api configuration
		"service:api:system:configuration:read",
		"service:api:system:configuration:update",
	],
	manager:[
		"service:api:system:all:all",
	],
	coursecreator:[
		"service:api:system:all:all",
	],
	editingteacher:[
		"service:api:system:all:all",
	],
	teacher:[
		"service:api:system:all:all",
	],
	student:[
		"service:api:system:all:all",
	],
	guest:[
		"service:api:system:all:all",
	],
	user:[
		"service:api:system:all:all",
	],
	frontpage:[
		"service:api:system:all:all",
	],
};