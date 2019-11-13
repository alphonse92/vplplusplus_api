import { pick } from 'lodash'

const Config = global.Config;

const Util = require(Config.paths.utils);

const Errors = require(Config.paths.errors + '/project.errors');
const Project = require(Config.paths.models + "/project/project/project.mongo");

const BaseService = require(Config.paths.services + '/service');
const TestService = require('./project.test.service');
const TestCaseService = require('./project.test.case.service');
const CourseServiceClass = require(Config.paths.services + '/moodle/moodle.course.service');

class ProjectService extends BaseService {

	constructor() {
		super(Project)
	}

	async get(CurrentUser, query, opts = { throwErrorIfNotExist: true, populate: true }) {
		try {

			const baseQuery = !CurrentUser ? {} : { owner: CurrentUser._id }

			const populates = [
				{
					path: 'summaries'
				},
				{
					path: 'tests',
					populate: {
						path: 'test_cases',
						populate: [
							{ path: 'topic' },
							{ path: 'summaries' }
						]
					}
				}]
			return await super.get({ ...query, ...baseQuery }, opts.populate ? populates : [], opts)
		} catch (e) {
			throw new Util.Error(Errors.project_doesnt_exist)
		}
	}

	async listUsingTheRequest(CurrentUser, req) {
		try {
			const queryByOwner = { owner: CurrentUser._id }
			const queryByPublic = { is_public: true }
			const query = { $or: [queryByOwner, queryByPublic] }
			return await super.listUsingTheRequest(req, {}, query)
		} catch (e) {
			throw new Util.Error(Errors.project_doesnt_exist)
		}
	}

	list(CurrentUser, customQuery = {}, populates) {
		const query = {
			$and: [
				customQuery,
				{
					$or: [
						{ owner: CurrentUser._id },
						{ is_public: true },
					]
				}
			]
		}
		return super
			.list(query)
			.populate(populates)
	}

	compile(CurrentUser, _id) {
		const { _id: owner } = CurrentUser
		const ProjectDoc = super.get({ owner, _id })
		return ProjectDoc.compile().code
	}

	async create(CurrentUser, data, opts = { forceSetAttributes: false }) {
		const { _id, tests = [], ...payloadProject } = data
		const { activity: activity_id } = payloadProject
		const isUpdate = !!_id

		// prevent modify project if it has summaries
		if (isUpdate) await this.validateHasSummaries(project)

		const project = opts.forceSetAttributes
			? { ...payloadProject }
			: pick(payloadProject, Project.getEditableFields())

		const ProjectDoc = isUpdate
			? await super.update({ _id, owner: CurrentUser._id }, project)
			: await super.create({ ...project, owner: CurrentUser._id })

		try {
			// if something happend here, then remove the project
			await TestService.createAll(CurrentUser, ProjectDoc, tests, opts)
			return ProjectDoc
		} catch (e) {
			if (!isUpdate) await this.delete(CurrentUser, ProjectDoc._id)
			throw e
		}

	}

	async delete(CurrentUser, project_id) {
		const SummaryService = require('./project.summary.service')
		const { _id: owner } = CurrentUser
		const ProjectDocument = await super.delete({ owner, _id: project_id })
		const { _id: project } = ProjectDocument;
		await TestService.deleteMany({ owner, project })
		await TestCaseService.deleteMany({ owner, project })
		await SummaryService.deleteMany({ project })

		return ProjectDocument

	}

	async validateHasSummaries(project) {
		const Summary = require(Config.paths.models + "/project/summary/summary.mongo");
		const ProjectSummaryDoc = await Summary.findOne({ project })
		if (ProjectSummaryDoc) throw new Util.Error(Errors.project_blocked)
	}


	async export(type, CurrentUser, id) {
		let exporter
		try { exporter = require('./exporters/' + type) }
		catch (e) {
			throw new Util.Error(Errors.exporter_does_not_exist)
		}
		const query = { _id: id, owner: CurrentUser._id }
		const ProjectDoc = await super.get(query, [
			{ path: 'owner' },
			{
				path: 'tests',
				populate: {
					path: 'test_cases',
					populate: {
						path: 'topic'
					}
				}
			}
		])
		return exporter(ProjectDoc)
	}
}

module.exports = new ProjectService()