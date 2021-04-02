import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ngx-print-header',
  templateUrl: './print-header.component.html',
  styleUrls: ['./print-header.component.scss']
})
export class PrintHeaderComponent implements OnInit {
  
  env = environment;
  
  constructor() { }

  ngOnInit() {
  }

}
