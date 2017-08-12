module.exports = (student) => {
  let letterScore
  if (student.student_subject.score == null)
    letterScore = 'empty'
  else if (student.student_subject.score > 85)
    letterScore = 'A'
  else if (student.student_subject.score > 70)
    letterScore = 'B'
  else if (student.student_subject.score > 55)
    letterScore = 'C'
  else
    letterScore = 'D'

  student.letterScore = letterScore
  return student
}
