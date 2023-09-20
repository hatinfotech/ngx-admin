import { Component, OnInit } from '@angular/core';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {

  constructor(
    public rsv: RootServices,
    ) { }

  ngOnInit() {
  }

}
