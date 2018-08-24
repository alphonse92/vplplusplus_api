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

