const alphabet = "abcdefghijklmnopqrstuvwxyz";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const special = "°!#%&/()=?¡*¨[]_:;|'¿+´{}-.,\"¬\\~`^><@";

module.exports.alphabet;
module.exports.ALPHABET;
module.exports.numbers;
module.exports.special;

module.exports.getCode = getCode;
function getCode(){
	let ts = Date.now().toString();
	let out = "";
	for(let idx in ts){
		let chars = !(idx % 2) ? alphabet : ALPHABET;
		let number = +ts[idx];
		out += chars[number];
	}
	return out;
}

