module.exports.createController = createController
function createController(controller){
	let handler = {
		get(target, propKey, receiver){
			const origMethod = target[propKey];
			return function(){
				let result = origMethod.apply(this, arguments);
				return result;
			};
		}
	};
	return new Proxy(controller, handler);
}