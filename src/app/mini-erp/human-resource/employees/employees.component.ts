import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-employees',
  styleUrls: ['./employees.component.scss'],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class EmployeesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
