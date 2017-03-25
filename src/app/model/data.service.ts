import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

export enum AnswerType { TFQ, MCQ, MAQ, UNKNOWN_LAST }

export class Question {
  public html: string
  public type = AnswerType.MCQ
  public solutions: boolean[] = []
  public answers: boolean[] = []
  public choices: string[] = []
  public isSelected = false
  constructor() { }
  public isDone(): boolean {
    let done = false
    this.answers.forEach(a => done = done || a)
    return done
  }
  public clearAllAnswers() {
    this.choices.forEach((_, i) => this.answers[i] = false)
  }
  public setAnswer(n: number) {
    if (this.type !== AnswerType.MAQ) this.clearAllAnswers()
    this.answers[n] = true
    //console.log(this.answers)
  }
  public isWrong(): boolean {
    let wrong = false
    if (this.isDone()) {
      this.choices.forEach((_, i) => {
        let sol = this.solutions[i]
        if (sol == null) sol = false
        let ans = this.answers[i]
        if (ans == null) ans = false
        wrong = wrong || (sol !== ans)
      })
    }
    return wrong
  }
}

export class Id {
  protected static _count = 0
  private _id: string
  public get id(): string {
    return this._id
  }
  public set id(val: string) {
    this._id = val
  }
  constructor(private prefix: string) {
    this._id = prefix + Id._count
    Id._count++
  }
}

export class Results {
  total: number = 0
  leftout: number = 0
  correct: number = 0
  wrong: number = 0
  percent(): number {
    let pc = Math.ceil((this.correct / this.total) * 100)
    return pc
  }
}

export class Exam extends Id {
  public readonly ARRAY_OUT_OF_BOUNDS = "Array out of bounds."
  public qs: Question[] = []
  public idd(): string {
    return this.id +"%"
  }
  public inAnswerMode = false
  private selected: number = 0
  constructor(public name: string = null, public when: Date = new Date()) {
    super("ee")
  }
  static copy(src, target: Exam) {
    target.name = src.name
    target.inAnswerMode = src.inAnswerMode
    src.qs.forEach((q, i) => {
      target.qs[i] = new Question()
      let thisq = target.qs[i]
      thisq.html = q.html
      thisq.type = q.type
      q.choices.forEach((_, j) => {
        thisq.choices[j] = q.choices[j]
        thisq.solutions[j] = q.solutions[j]
        thisq.answers[j] = q.answers[j]
      })
    })
  }
  reset() {
    Exam.static_reset(this)
  }
  static static_reset(exam: Exam) {
    exam.inAnswerMode = false
    exam.qs.forEach((q, i) => {
      q.answers = []
    })
  }
  static clone(exam: Exam, shallow = true) {
    let newExam = new Exam()
    Exam.copy(exam, newExam)
    if (shallow) Exam.static_reset(newExam)
    return newExam
  }

  public select(n: number) {
    if (n < 0 || n >= this.qs.length) throw this.ARRAY_OUT_OF_BOUNDS
    if (this.selected != null) this.qs[this.selected].isSelected = false
    this.selected = n
    this.qs[this.selected].isSelected = true
  }
  public selectNone() {
    this.selected = null
    this.qs.forEach(q => q.isSelected = false)
  }
  public isResultsPage(): boolean {
    return this.selected == null
  }
  public next(): number {
    if (this.selected == null) return 0
    if (this.selected < this.qs.length - 1) {
      return this.selected * 1 + 1// WHY?!
    }
    return null
  }
  public scoreResults(): Results {
    let results = new Results();
    this.qs.forEach(q => {
      results.total++
      if (q.isDone()) {
        if (q.isWrong()) results.wrong++
        else results.correct++
      } else results.leftout++
    })
    return results
  }
}

export class ExamResult extends Exam {
  constructor(readonly exam: Exam,
    readonly when: Date = new Date()) {
    super("rr")
    Exam.copy(exam, this)
  }
  percent(): number {
    return this.scoreResults().percent()
  }
}

export class Lib {
  static times(n: number): number[] {
    let arr = []
    for (var i = 0; i < n; i++) arr[i] = i
    return arr
  }
  static rndn(ncount: number, nmin: number = 0): number {
    let rndi = Math.random() * ncount
    return Math.floor(rndi) + nmin
  }
  //default is 50% probability
  static toss(b: number = 2, a: number = 1): boolean {
    return Lib.rndn(b) < a
  }
  static rndDate(): Date {
    let y = Lib.rndn(2, 2015)
    let m = Lib.rndn(12, 1)
    let d = Lib.rndn(28, 1)
    return new Date(y + '-' + m + '-' + d)
  }
  static rndArray<T extends Id>(total: number,
    fcreate: () => T, fuse: (T) => void): T[] {
    let arr: T[] = []
    for (var i = 0; i < total; i++) {
      let t = fcreate()
      arr.push(t)
      fuse(t)
    }
    return arr;
  }
}

@Injectable()
export abstract class DataService {

  public exams$: Observable<Exam[]>
  public results$: Observable<ExamResult[]>

  public testMe(n: number): number {
    return n * 2
  }

  public abstract getExam(eid: string): Exam
  public abstract getQuestion(eid: string, qid: string): Question
  public abstract saveExam(exam: Exam)
}
