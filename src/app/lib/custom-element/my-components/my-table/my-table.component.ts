import { Component, Input, OnInit } from '@angular/core';

export interface MytableContent {
  header: { name: string, title: string, [key: string]: any }[];
  data: any[]
}

@Component({
  selector: 'ngx-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.scss']
})
export class MyTableComponent implements OnInit {

  @Input() content: MytableContent;
  constructor() { }

  ngOnInit() {
  }

}
