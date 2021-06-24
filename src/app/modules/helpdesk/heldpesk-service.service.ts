import { HelpdeskTicketModel } from './../../models/helpdesk.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeldpeskServiceService {

  onUpdateTickets$ = new BehaviorSubject<HelpdeskTicketModel[]>(null);
  constructor() { }
}
