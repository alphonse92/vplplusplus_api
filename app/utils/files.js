const fs = require("fs")
module.exports.readDir = readDir;
function readDir(folderPath){
	return new Promise((resolve, reject) => {
		fs.readdir(folderPath, (err, files) => {
			if(err)
				reject(err);
			resolve(files);
		})
	})
}