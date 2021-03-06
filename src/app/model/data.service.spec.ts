import {
  TestBed, async, inject, fakeAsync,
  discardPeriodicTasks, tick, getTestBed,
} from '@angular/core/testing';

import { Holders, DataService, DataSource, SecuritySource, isin } from './data.service';
import { User, UserRole, EMPTY_USER } from './user';

import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { EMPTY_EXAM, Exam } from '../model/exam';
import { EMPTY_QUESTION } from '../model/question';
import { GeneralContext } from '../model/general-context';

const HOLDERS = new Holders([EMPTY_EXAM], [EMPTY_EXAM_RESULT], [EMPTY_USER])

let dataSourceMock = {
  getHolders: (user: User) => Promise.resolve(HOLDERS),
  createExam: (user: User, eid: string) => Promise.resolve(EMPTY_EXAM_RESULT),
  updateExam: (user: User, result: ExamResult) => Promise.resolve(true),
  deleteExam: (user: User, rid: string) => Promise.resolve(true)
}

let securitySourceMock = {
  userWait: () => Promise.resolve(EMPTY_USER)
}

let generalContextMock = {
}

function makeSpy(cls: any, method: string) {
  return spyOn(getTestBed().get(cls), method).and.callThrough()
}

describe('DataService tests:', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DataSource, useValue: dataSourceMock },
        { provide: SecuritySource, useValue: securitySourceMock },
        { provide: GeneralContext, useValue: generalContextMock },
        { provide: DataService, useClass: DataService },
      ]
    })
  })

  it('creation and dummy works', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
    expect(service.testMe(3)).toBe(6)
    expect(service.testMe(2)).toBe(4)
  }));

  it('creation flow works', fakeAsync(inject([DataService], (service: DataService) => {
    discardPeriodicTasks() // WOW! https://github.com/angular/angular/issues/8251
    tick()
    expect(service).toBeTruthy();
    expect(service.exams.length).toBe(1)
    expect(service.exams[0].id).toBe(HOLDERS.exams[0].id)
    expect(service.results.length).toBe(1)
    expect(service.results[0].id).toBe(HOLDERS.results[0].id)
  })))

  it('primary flow works', fakeAsync(inject([DataService], (service: DataService) => {
    discardPeriodicTasks() // WOW! https://github.com/angular/angular/issues/8251
    tick()
    expect(service).toBeTruthy();
    let dsCreateSpy = makeSpy(DataSource, 'createExam')
    let dsUpdateSpy = makeSpy(DataSource, 'updateExam')
    let dsDeleteSpy = makeSpy(DataSource, 'deleteExam')

    service.startExam('dummy');
    tick()
    expect(dsCreateSpy).toHaveBeenCalledTimes(1);

    service.saveExam();
    tick()
    expect(dsUpdateSpy).toHaveBeenCalledTimes(1);

    service.finishExam();
    tick()
    expect(dsUpdateSpy).toHaveBeenCalledTimes(2);
  })))

  it('secondary flow works', fakeAsync(inject([DataService], (service: DataService) => {
    discardPeriodicTasks() // WOW! https://github.com/angular/angular/issues/8251
    tick()
    expect(service).toBeTruthy();
    let dsCreateSpy = makeSpy(DataSource, 'createExam')
    let dsUpdateSpy = makeSpy(DataSource, 'updateExam')
    let dsDeleteSpy = makeSpy(DataSource, 'deleteExam')

    service.startExam('dummy');
    tick()
    expect(dsCreateSpy).toHaveBeenCalledTimes(1);

    service.pauseExam();
    tick()
    expect(dsUpdateSpy).toHaveBeenCalledTimes(1);

    service.cancelExam();
    tick()
    expect(dsDeleteSpy).toHaveBeenCalledTimes(1);
  })))

  it('getExam getQuestion works', fakeAsync(inject([DataService], (service: DataService) => {
    discardPeriodicTasks() // WOW! https://github.com/angular/angular/issues/8251
    tick()
    console.log = jasmine.createSpy('log').and.stub();
    let eid = HOLDERS.exams[0].id
    let qid = HOLDERS.exams[0].questions[0].id

    expect(() => service.getExam('89')).toThrow()
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(() => service.getExam(eid)).not.toThrow()
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(service.getQuestion(eid, '89')).toBeUndefined()
    expect(service.getQuestion(eid, qid).id).toBe(qid)
  })))

})

describe('isin tests:', () => {
  it('is in, checked', () => {
    expect(isin([1, 2, 4], 1)).toBeTruthy()
    expect(isin([1, 2, 4], 4)).toBeTruthy()
    expect(isin([1, 2, 4], 3)).toBeFalsy()
    expect(isin([1, 2, 4], 0)).toBeFalsy()
    expect(isin([1], 1)).toBeTruthy()
    expect(isin([0], 1)).toBeFalsy()
    expect(isin([], 1)).toBeFalsy()
  })
})
