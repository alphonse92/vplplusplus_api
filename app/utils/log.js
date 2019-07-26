module.exports = function () {
	let types = [];
	let args = [];
	for (let arg in arguments) {
		let val = arguments[arg];
		let typeDataObjc = Array.isArray(val) ? "array" : typeof val;
		args.push("[" + typeDataObjc + "]")
		if (typeDataObjc === "object") {
			let json = JSON.stringify(val, null, 2);
			arguments[arg] = json === "{}" ? val : json;
		}
		args.push(arguments[arg]);
	}

	console.log.apply(console.log, args);
}