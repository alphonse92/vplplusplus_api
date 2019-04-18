const Config = global.Config;
const Util = require(Config.paths.utils);
const Bcrypt = require("bcrypt-nodejs");
const UserErrors = require(Config.paths.errors + "/user.errors");
module.exports = Auth;
function Auth(usernameOrEmail, password){
	let connection = null;
	return createConnection()
		.then(conn => connection = conn)
		.then(() => findMysqlUserMoodle(connection, usernameOrEmail))
		.then(UserRow => validePassword(UserRow, password))
		.then(UserRow => valideIfIsSiteAdmin(connection, UserRow))
		.then(UserRow => getRoleAssigments(connection, UserRow))
		.then(UserRow => getRoles(connection, UserRow))
		.then(UserRow => {
			connection.end();
			return Promise.resolve(UserRow);
		})


}
function createConnection(){
	return  require(Config.paths.db + "/mysql")();
}

/**
 * This function retreive a data of a moodle user, querying to the 
 * mysql moodle database.
 * @param {*} connection Mysql Connection
 * @param {*} usernameOrEmail  Email or username of a User
 */
function findMysqlUserMoodle(connection, usernameOrEmail){
	let isEmail = usernameOrEmail.indexOf("@") >= 0;
	let column = isEmail ? "email" : "username";
	let val = usernameOrEmail;
	return new Promise((resolve, reject) => {
		const table = Config.moodle.db.table_prefix + "user";
		const sql = 'SELECT * FROM ' + table + ' WHERE ' + column + '=? AND deleted=0';
		connection.query(sql, [val], function(err, data, fields){
			if(err)
				return reject(err);
			resolve(data[0]);
		});
	})

}

/**
 * This function validate the password of the User
 * @param {*} UserRow 
 * @param {*} password 
 */
function validePassword(UserRow, password){
	if(!UserRow)
		return Promise.reject(UserErrors.login_fail);
	return new Promise((resolve, reject) => {
		let hash = UserRow.password.replace(/^\$2y(.+)$/i, '$2a$1');
		Bcrypt.compare(password, hash, function(err, res){
			if(err)
				return reject(err);
			if(!res)
				return reject(UserErrors.login_fail);
			resolve(UserRow);
		});
	})
}
/**
 * Function to valide if the User that attempt to login is a a siteadmin
 * @param {*} connection 
 * @param {*} UserRow 
 */
function valideIfIsSiteAdmin(connection, UserRow){
	return new Promise((resolve, reject) => {
		const table = Config.moodle.db.table_prefix + "config";
		const sql = 'SELECT * FROM ' + table + ' WHERE name=\'siteadmins\'';
		connection.query(sql, function(err, data, fields){
			if(err)
				return reject(err);
			UserRow.is_site_admin = data[0].value.split(",").map(id => +id).includes(UserRow.id);
			return resolve(UserRow);
		});
	})
}
/**
 * This function get the role assigments for the user
 * @param {*} connection 
 * @param {*} UserRow 
 */
function  getRoleAssigments(connection, UserRow){
	return new Promise((resolve, reject) => {
		const table = Config.moodle.db.table_prefix + "role_assignments";
		const sql = 'SELECT * FROM ' + table + ' WHERE userid=' + UserRow.id;
		connection.query(sql, function(err, data, fields){
			if(err)
				return reject(err);
			UserRow.roles = data.map(role_assignment => role_assignment.roleid);
			resolve(UserRow);
		});
	})

}

/**
 * Finally this function retreives the roles for the user
 * @param {*} connection 
 * @param {*} UserRow 
 */
function  getRoles(connection, UserRow){
	if(!UserRow.roles.length)
		return Promise.resolve(UserRow);

	return new Promise((resolve, reject) => {
		const table = Config.moodle.db.table_prefix + "role";
		const sql = 'SELECT * FROM ' + table + ' WHERE id IN (' + UserRow.roles.join(",") + ")";
		connection.query(sql, function(err, data, fields){
			if(err)
				return reject(err);
			UserRow.roles = data;
			resolve(UserRow);
		});
	})

}

