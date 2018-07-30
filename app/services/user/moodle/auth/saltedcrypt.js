const Config = global.Config;
const Bcrypt = require("bcrypt-nodejs");
const UserErrors = require(Config.paths.errors + "/user.errors");
module.exports = Auth;
function Auth(email, password){
	let connection = null;
	return createConnection()
		.then(conn => connection = conn)
		.then(() => findMysqlUserMoodle(connection, email))
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

function findMysqlUserMoodle(connection, email){
	return new Promise((resolve, reject) => {
		const table = Config.moodle.db.table_prefix + "user";
		connection.query('SELECT * FROM ' + table + ' WHERE email=? AND deleted=0', [email], function(err, data, fields){
			if(err)
				return reject(err);
			resolve(data[0]);

		});
	})

}
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

