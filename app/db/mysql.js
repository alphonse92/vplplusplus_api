const Config = global.Config;
const mysql = require("mysql");
module.exports = () => new Promise((resolve, reject) => {
		const connection = mysql.createConnection(Config.db.mysql);
		connection.connect((err) => {
			if(err)
				reject(err);
			resolve(connection);
		})
	})

