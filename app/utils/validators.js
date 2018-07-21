module.exports = {
	email:function(v){
		var re = /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,15})$/;
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