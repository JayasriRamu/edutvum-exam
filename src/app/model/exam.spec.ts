import { AnswerType } from './answer-type';
import { Question } from './question';
import { Exam } from './exam';
import { Score } from './score';

let createQ = (type: AnswerType, choices: string[], sols: number[], title = "TEST Q..."): Question => {
  return new Question(title, type, choices, sols)
}
let createE = (questions: Question[], title = "TEST E...", id: string = '00'): Exam => {
  return new Exam(id, title, questions)
}
let doE = (questions: Question[]): Exam => {
  let e = createE(questions)
  return e
}

let tfq = () => createQ(AnswerType.TFQ, ["C1", "C2"], [0])
let mcq = () => createQ(AnswerType.MCQ, ["C1", "C2", "C3"], [2])
let arq = () => createQ(AnswerType.ARQ, ["C1", "C2", "C3", "C4", "C5"], [3])
let maq = () => createQ(AnswerType.MAQ, ["C1", "C2", "C3"], [0, 2])
let questions0 = () => []
let questions1 = () => [tfq()]
let questions2 = () => [tfq(), maq()]
let questions8 = () => [tfq(), tfq(), mcq(), mcq(), arq(), arq(), maq(), maq()]

let checkScore = (s: Score, t: number, c: number, w: number, l: number, p: number) => {
  expect(s.total).toBe(t)
  expect(s.correct).toBe(c)
  expect(s.wrong).toBe(w)
  expect(s.leftout).toBe(l)
  expect(s.percent()).toBe(p)
}

describe('Exam:', () => {
  it('should have id', () => {
    expect(() => createE(questions1(), null, null)).toThrow()
    expect(() => createE(questions1())).not.toThrow()
    let e = createE(questions1(), 'dummy titile', '1729')
    expect(e.id).toBe('1729')
  })
  it('should have title', () => {
    expect(() => createE(questions1(), null)).toThrow()
    expect(() => createE(questions1())).not.toThrow()
    let e = createE(questions1(), 'DUMMY', '1729')
    expect(e.title).toBe('DUMMY')
  })
  it('should have questions', () => {
    expect(() => createE(null)).toThrow()
    expect(() => createE(questions0())).toThrow()
    expect(() => createE(questions1())).not.toThrow()
  })

  it('q nav works', () => {
    let e = createE(questions2())
    expect(e.nextq(null)).toBe(0)
    expect(e.nextq(-1)).toBe(0)
    expect(e.nextq(0)).toBe(1)
    expect(e.nextq(1)).toBe(null)
    expect(e.nextq(3)).toBe(null)
  })

})