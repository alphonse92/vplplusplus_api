const Config = global.Config;
const Util = require(Config.paths.utils);
const UserMongo = require("./mongo/user.mongo");
const Bcrypt = require("bcrypt-nodejs");
class User{
	static auth(email, password){
		return new Promise((resolve, reject) => {
			const connector = require(Config.paths.db + "/mysql")();
			let connection = null;
			connector.then(conn => {
				connection = conn;
				connection.query('SELECT * FROM  mdl_user WHERE email=?', [email], function(err, data, fields){
					if(err)
						reject(err);
					resolve(data[0]);
					connection.end();
				});
			})
		}).then(UserRow => {
			if(!UserRow)
				return Promise.reject("user not found");
			return new Promise((resolve, reject) => {
				let hash = UserRow.password.replace(/^\$2y(.+)$/i, '$2a$1');
				Bcrypt.compare(password, hash, function(err, res){
					if(err)
						reject(err);
					if(!res)
						reject("user not found");
					resolve(UserRow);
				});
			})
		})
	}
}

module.exports = User;