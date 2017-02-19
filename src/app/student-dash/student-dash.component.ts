import { Component, OnInit } from '@angular/core';
//http://momentjs.com/docs/
import * as moment from 'moment';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dash',
  templateUrl: './student-dash.component.html',
  styleUrls: ['./student-dash.component.css'],
})
export class StudentDashComponent {

  constructor(
    private service: StudentService,
    private router: Router) { }

  showWhen(dt: Date): string {
    return moment(dt).fromNow();
  }

  takeExam(ex) {
    console.log(ex.exam)
    this.router.navigate(['/exam', ex.id, 0])
  }
  showExamResult(ex) {
    console.log(ex.exam + " " + ex.percent)
    this.router.navigate(['/exam-result', ex.id, 0])
  }
}
