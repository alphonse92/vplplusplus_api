module.exports = function(){
	for(let arg in arguments){
		let val = arguments[arg];
		if(typeof val === "object"){
			let json = JSON.stringify(val, null, 2);
			arguments[arg] = json === "{}" ? val : json;
		}

	}
	console.log.apply(console.log, arguments);
}