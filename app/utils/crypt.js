const Config = global.Config;
module.exports.getHash = getHash;
function getHash(salt, string){
	const Bcrypt = require("bcrypt-nodejs");
	return new Promise((resolve, reject) => {
		Bcrypt.hash(string, salt, null, function(err, hash){
			if(err)
				reject(err);
			resolve({hash, salt});
		});
	})

}
