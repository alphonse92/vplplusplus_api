module.exports = [
  { resource: "service:api:system:public" },
  // students
  { resource: "service:api:system:user.student.list" },
  // projects
  { resource: "service:api:system:project.list" },
  { resource: "service:api:system:project.get" },
  { resource: "service:api:system:project.compile" },
  { resource: "service:api:system:project.export" },
  { resource: "service:api:system:project.create" },
  { resource: "service:api:system:project.update" },
  { resource: "service:api:system:project.delete" },
  // tests
  { resource: "service:api:system:test.list" },
  { resource: "service:api:system:test.compile" },
  { resource: "service:api:system:test.create" },
  { resource: "service:api:system:test.update" },
  { resource: "service:api:system:test.delete" },
  // tests cases
  { resource: "service:api:system:test.case.list" },
  { resource: "service:api:system:test.case.compile" },
  { resource: "service:api:system:test.case.create" },
  { resource: "service:api:system:test.case.update" },
  { resource: "service:api:system:test.case.delete" },
  // summaries
  { resource: "service:api:system:test.case.summary.list" },
  // Topics
  { resource: "service:api:system:topic.list" },
  // reports
  { resource: "service:api:system:projects.report.list" },
  { resource: "service:api:system:projects.report.user.list" },
  { resource: "service:api:system:projects.report.user.get" }, ,
  { resource: "service:api:system:projects.report.user.evolution.list" },
  { resource: "service:api:system:projects.report.user.evolution.get" },
  { resource: "service:api:system:project.report.get", },
  { resource: "service:api:system:project.report.user.get", },
  { resource: "service:api:system:project.report.user.list", },
  { resource: "service:api:system:project.report.timeline", },
  { resource: "service:api:system:student.report.timeline", },
  { resource: "service:api:system:topic.report.timeline", },
  
  //activities
  { resource: "service:api:system:course.activity.list" },
  // web client
  { resource: "client:web:system:webclient.lab.show" },
  { resource: "client:web:system:webclient.students.show" },
  { resource: "client:web:system:webclient.reports.show" },
  { resource: "client:web:system:webclient.logout.show" },

]