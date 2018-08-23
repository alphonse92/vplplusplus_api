module.exports.createSyncDocumentFunction = createSyncDocumentFunction;
function createSyncDocumentFunction(Model){
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
		return Model.find({id:{$in:ids}})
			.then(ModelsDocs => {
				let existingMongoModels = ModelsDocs.reduce((acc, curr) => {
					acc[curr.id] = curr;
					return acc;
				}, {});


				return arrayOfMoodleModelsInfo
					.map(moodleModelToUpdate => {
						let mongoDoc = existingMongoModels[moodleModelToUpdate.id];
						if(!mongoDoc)
							return  Model.create(moodleModelToUpdate);
						moodleModelToUpdate._id = mongoDoc._id;
						let model = new Model(moodleModelToUpdate);
						model.markModified('id'); //force to update
						return model.save();
					})

			})
	}
}

