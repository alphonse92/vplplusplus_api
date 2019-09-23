import moment from 'moment'
import { capitalize, camelCase, orderBy } from 'lodash'
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



  getTestCasesByDifficult(report) {
    const map = report
      .reduce((testMap, userReport) => {

        const { skills = [] } = userReport

        skills.forEach(skill => {
          const { tests } = skill
          return tests.forEach(({ _id, name, objective, summaries_not_approved }) => {
            testMap[_id] = testMap[_id]
              ? { ...testMap[_id], summaries_not_approved: testMap[_id].summaries_not_approved + summaries_not_approved.length }
              : { _id, name, objective, summaries_not_approved: summaries_not_approved.length }
          })
        })

        return testMap

      }, {})

    return orderBy(Object.values(map), ['summaries_not_approved'], ['desc'])

  }

  getTheMostSkilledStudentByTopic(report) {

    const map = report
      // flat
      .map(userReport => {
        const { id, firstname, lastname, skills = [] } = userReport
        const fullname = `${firstname} ${lastname}`
        return skills.map(skill => {
          const { name, description, info: { level } } = skill
          return { student: { id, fullname }, topic: { name, description, level } }
        })
      })
      // put all in a single array
      .reduce((acc, arrayOfUserTopics) => acc.concat(arrayOfUserTopics), [])
      // map the topics
      .reduce((map, userReport) => {
        const { student: studentTopic, topic } = userReport
        const { id, fullname } = studentTopic
        const { name, description, level: noFixedLevel } = topic
        const level = +noFixedLevel.toFixed(2)
        const student = { id, fullname }
        const skillInMap = map[name]
        if (!skillInMap || (skillInMap && level > skillInMap.level)) {
          return { ...map, [name]: { name, description, level, students: [student] } }
        } else if (level === skillInMap.level) {
          const students = map[name].students.concat([student])
          return { ...map, [name]: { name, description, level, students } }
        } else {
          return { ...map }
        }

      }, {})

    return orderBy(Object.values(map), ['level'], ['desc'])
  }



}

module.exports = new SummaryReportService()