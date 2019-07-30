/**
 * Static methods for mongo model 
 */

export function getEffort(TestCaseDocs) {
  const SummaryDocs = TestCaseDocs.reduce((array, testCase) => array.concat(testCase.summaries), [])
  const s = TestCaseDocs.length
  const a = SummaryDocs.length

  if (a < s) throw new Util.Error() // The ammount of summaries cant be less than Amount of test cases

  return s / a
}

export function getNegativeCoefficient(TestCaseDocs) {
  const CasesResolved = AllCasesOfTest.filter((TestCase) => !!TestCase.isApproved)
  const T = TestCaseDocs.length
  const R = CasesResolved.length
  return (T + 1) / (R + 1)
}


export function getSkill(TestCaseDocs) {
  const T = TestCase.length
  const C = SummaryReportService.getNegativeCoefficient(TestCaseDocs)
  const E = SummaryReportService.getEffort(TestCaseDocs)
  const S = T / (E * C)
  return {
    cases: T,
    negativeCoefficient: C,
    effort: E,
    level: S,
  }
}