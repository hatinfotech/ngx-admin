import { Component, OnInit } from '@angular/core';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-helpdesk-ticket-form',
  templateUrl: './helpdesk-ticket-form.component.html',
  styleUrls: ['./helpdesk-ticket-form.component.scss'],
})
export class HelpdeskTicketFormComponent implements OnInit {

  constructor(
    public rsv: RootServices
    ) { }

  ngOnInit() {
  }

}
