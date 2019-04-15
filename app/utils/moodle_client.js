const errorCodesHttpStatus = {
	nopermissions: 401
}
module.exports.errorCodesHttpStatus = errorCodesHttpStatus;
module.exports.getError = getError;
function getError(MoodleAPIResponse) {
	return {
		http_code:errorCodesHttpStatus[MoodleAPIResponse.errorcode],
		error:{
			message:MoodleAPIResponse.message
		}
	}
}


module.exports.isError = isError;
function isError(MoodleAPIResponse) {
	return MoodleAPIResponse.exception || MoodleAPIResponse.errorcode;
}

module.exports.handleResponse = handleResponse;
function handleResponse(MoodleAPIResponse){
	return isError(MoodleAPIResponse) ?
		Promise.reject(getError(MoodleAPIResponse)) :
		Promise.resolve(MoodleAPIResponse);
}

module.exports.createSyncDocumentFunction = createSyncDocumentFunction;
function createSyncDocumentFunction(Model, opt) {

	//Default options

	opt.valide = opt.valide || (() => true); //by default it will update the model.
	opt.transform = opt.transform || ((MongoDoc, moodleModelToUpdate) => Object.assign(MongoDoc, moodleModelToUpdate))

	/**
	 * @param arrayOfMoodleModelsInfo [Array]
	 *    Array with structured Model data. It will use the id property to valide
	 *    if exist in db, else this will add the new course
	 */
	return (arrayOfMoodleModelsInfo) => {
		arrayOfMoodleModelsInfo = Array.isArray(arrayOfMoodleModelsInfo) ?
			arrayOfMoodleModelsInfo :
			[arrayOfMoodleModelsInfo];
		let ids = arrayOfMoodleModelsInfo.map(moodleModel => moodleModel.id);
		return Model.find({ id: { $in: ids } })
			.then(ModelsDocs => {
				let existingMongoModels = ModelsDocs.reduce((acc, curr) => {
					acc[curr.id] = curr;
					return acc;
				}, {});

				let promises = arrayOfMoodleModelsInfo
					.map(moodleModelToUpdate => {
						let mongoDoc = existingMongoModels[moodleModelToUpdate.id];
						if (!mongoDoc)
							return Model.create(moodleModelToUpdate);
						return updateModelIfIsNecesary(mongoDoc, moodleModelToUpdate)
					});
				return Promise.all(promises)

			})
	}


	function updateModelIfIsNecesary(mongoDoc, moodleModelToUpdate) {
		if (opt.valide(mongoDoc, moodleModelToUpdate)) {
			mongoDoc = opt.transform(mongoDoc);
			return mongoDoc.save();
		}
		return Promise.resolve(mongoDoc)
	}



}

