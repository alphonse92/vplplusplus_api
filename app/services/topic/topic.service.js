import { pick } from 'lodash'

const Config = global.Config;
const Util = require(Config.paths.utils);
const BaseService = require(Config.paths.services + '/service');
const Errors = require(Config.paths.errors + '/topic.errors');
const Topic = require(Config.paths.models + "/topic/topic.mongo");
const TestCaseService = require(Config.paths.services + '/project/project.test.case.service');

class TopicService extends BaseService {

	constructor() {
		super(Topic)
	}

	async list(query) {
		try {
			return await super.list(query)
		} catch (e) {
			throw new Util.Error(Errors.topic_does_not_exist)
		}
	}

	async listUsingTheRequest(CurrentUser, req) {
		try {
			return await super.listUsingTheRequest(req, {}, { owner: CurrentUser._id })
		} catch (e) {
			throw new Util.Error(Errors.topic_does_not_exist)
		}
	}

	createAll(CurrentUser, ArrayOfData) {
		const set = Array.isArray(ArrayOfData) ? ArrayOfData : [ArrayOfData]
		return Promise.all(set.map(topic => this.create(CurrentUser, topic)))
	}

	async create(CurrentUser, TokenData) {
		try {
			const { _id: owner } = CurrentUser
			const { name, description } = pick(TokenData, ['name', 'description'])
			const topic = await super.get({ name }, null, { throwErrorIfNotExist: false }) // get a not deleted topic with the same name
			if (topic) throw new Util.Error(Errors.topic_already_exists)
			return super.create({ owner, name, description })
		} catch (e) {
			throw new Util.Error(e)
		}
	}

	async delete(CurrentUser, topic_id) {
		const TestCase = TestCaseService.getModel()
		const TestCaseDocs = await TestCase
			.find({ topic: topic_id })
			.populate('summaries')
			.exec()

		const hasSummaries = TestCaseDocs.reduce((acc, testCaseDoc) => {
			return acc || !!(testCaseDoc.summaries.length)
		}, false)

		if (hasSummaries) throw new Util.Error(Errors.topic_has_summaries)

		try {
			const { _id: owner } = CurrentUser
			return super.delete({ owner, _id: topic_id }, { deleted_at: Date.now() })
		} catch (e) { throw new Util.Error(Errors.topic_does_not_exist) }

	}

}

module.exports = new TopicService()