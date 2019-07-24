import { pick } from 'lodash'

const Config = global.Config;
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/topic.errors');
const Topic = require(Config.paths.models + "/topic/topic.mongo");
const Util = require(Config.paths.utils);

class TopicService extends BaseService {

	constructor() {
		super(Topic)
	}

	async listUsingTheRequest(CurrentUser, req) {
		try {
			return await super.listUsingTheRequest(req, {}, { owner: CurrentUser._id, deleted_at: null })
		} catch (e) {
			throw new Util.Error(Errors.topic_does_not_exist)
		}
	}

	async create(CurrentUser, TokenData) {
		try {
			const { _id: owner } = CurrentUser
			const { name, description } = pick(TokenData, ['name', 'description'])
			const topic = await super.get({ name, deleted_at: null }, null, { throwErrorIfNotExist: false }) // get a not deleted topic with the same name
			if (topic) throw new Util.Error(Errors.topic_already_exists)
			return super.create({ owner, name, description })
		} catch (e) {
			throw new Util.Error(e)
		}
	}

	delete(CurrentUser, topic_id) {
		try {
			const { _id: owner } = CurrentUser
			return super.update({ owner, _id: topic_id, deleted_at: null }, { deleted_at: Date.now() })
		} catch (e) { throw new Util.Error(Errors.topic_does_not_exist) }

	}

}

module.exports = new TopicService()