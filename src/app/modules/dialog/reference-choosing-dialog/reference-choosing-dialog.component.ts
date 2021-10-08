import { Component, Input, OnInit, TemplateRef, Type } from '@angular/core';

@Component({
  selector: 'ngx-reference-choosing-dialog',
  templateUrl: './reference-choosing-dialog.component.html',
  styleUrls: ['./reference-choosing-dialog.component.scss']
})
export class ReferenceChoosingDialogComponent<T> implements OnInit {

  @Input() components: {[key: string]: {
    // name: string,
    [key: string]: any,
    title: string,
  }};
  @Input() onDialogChoose?: (chooseItems: any[], type?: string) => void;
  
  constructor() { }

  ngOnInit(): void {
  }

  // onDialogChoose(data: any[]) {
  //   console.log(data);
  // }

}
