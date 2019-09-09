import moment from 'moment'
import { capitalize, camelCase } from 'lodash'
import { ProjectAggregator } from './agregators/project.summary.report.agregator';

const mongoose = require('mongoose')
const Projectservice = require('./project.service');

class SummaryReportService {

  createProjectReports(ArrayOfProjectDoc) {
    const array = Array.isArrray(ArrayOfProjectDoc)
      ? ArrayOfProjectDoc
      : [ArrayOfProjectDoc]
    return Promise.all(array.map(this.createProjectReport))
  }

  getDatesFromOptions(opts) {
    const { from, to } = opts
    const dates = {}
    if (from) dates.from = moment(from)
    if (to) dates.to = moment(to)
    return dates
  }

  createName(ProjectDoc, StudentUserDoc, opts) {
    const dates = this.getDatesFromOptions(ProjectDoc, opts)
    const { from, to } = dates
    const stamp = [from, to].join('-')
    const { _id: project_id } = ProjectDoc
    return UserDoc
      ? `VplReport ${project_id} of student: ${StudentUserDoc.id}-${capitalize(camelCase(StudentUserDoc.firstname + ' ' + StudentUserDoc.lastname))}-${stamp}`
      : project_id
        ? `VplReport ${project_id}-${stamp}`
        : `VplReport all-${stamp}`
  }

  safeToDate(momentDate) {
    return momentDate
      ? momentDate.toDate()
      : undefined
  }

  async getUserReport(CurrentUser, project_id, moodle_user, opts) {
    const { topic } = opts
    const topicQuery = topic
      ? {
        'topic.name': {
          $in: Array.isArray(topic)
            ? topic
            : [topic]
        }
      } : {}
    const { from, to } = this.getDatesFromOptions(opts)
    const $gte = this.safeToDate(from)
    const $lte = this.safeToDate(to)

    const project_id_array = !project_id
      ? []
      : Array.isArray(project_id)
        ? project_id
        : [project_id]
    const moodle_user_array = !moodle_user
      ? []
      : Array.isArray(moodle_user)
        ? moodle_user
        : [moodle_user]

    const querySummary = {}

    const projectFindQuery = project_id_array.length
      ? { _id: { $in: project_id_array.map(id => new mongoose.Types.ObjectId(id)) } }
      : {}
    const projectOwnerQuery = { owner: CurrentUser._id }
    const projectQuery = { ...projectFindQuery, ...projectOwnerQuery }
    if (moodle_user_array.length) querySummary["summary.moodle_user"] = { $in: moodle_user_array }
    if ($gte || $lte) {
      const dates = {}
      if ($gte) dates.$gte = $gte
      if ($lte) dates.$lte = $lte
      querySummary["summary.createdAt"] = dates
    }



    const queries = {
      project: projectQuery,
      summary: querySummary,
      topic: topicQuery
    }

    const aggregator = ProjectAggregator(queries)
    const Report = await Projectservice
      .getModel()
      .aggregate(aggregator)

    return Report

  }

}

module.exports = new SummaryReportService()