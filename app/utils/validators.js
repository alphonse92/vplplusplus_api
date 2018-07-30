module.exports = {
	email:function(v){
		var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		return !v || !v.trim().length || re.test(v);
	},
	ObjectId:function(v){
		const ObjectId = require('mongoose').Types.ObjectId;
		try{
			new ObjectId(v);
			return true;
		}catch(e){
			return false;
		}
	}
}