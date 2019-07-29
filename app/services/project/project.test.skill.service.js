module.exports.getEffort = getEffort
function getEffort(TestCaseDocs) {
  const SummaryDocs = TestCaseDocs.reduce((array, testCase) => array.concat(testCase.summaries), [])
  const s = TestCaseDocs.length
  const a = SummaryDocs.length

  if (a < s) throw new Util.Error() // The ammount of summaries cant be less than Amount of test cases

  return s / a
}
module.exports.getNegativeCoefficient = getNegativeCoefficient
function getNegativeCoefficient(TestCaseDocs) {
  const CasesResolved = AllCasesOfTest.filter((TestCase) => !!TestCase.isApproved)
  const T = TestCaseDocs.length
  const R = CasesResolved.length
  return (T + 1) / (R + 1)
}

module.exports.getSkill = getSkill
function getSkill(TestCaseDocs) {
  const T = TestCase.length
  const C = SummaryReportService.getNegativeCoefficient(TestCaseDocs)
  const E = SummaryReportService.getEffort(TestCaseDocs)
  return T / (E * C)
}