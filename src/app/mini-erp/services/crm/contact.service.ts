import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiResource } from '../api-resoure-interface';
import { PriceReport } from '../../models/sales/price-report.model';
import { Contact } from '../../models/crm/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements ApiResource<Contact> {

  constructor(private apiService: ApiService) { }

  get(params: Object, success: (resources: Contact[]) => void, error: (e) => void) {
    this.apiService.get<Contact[]>('/contact/contacts', params, success, error);
  }
  getById(id: string, success: (resources: Contact) => void, error: (e) => void) {
    this.apiService.get<Contact>('/contact/contacts', { 'id': id}, success, error);
  }
  post(resource: Contact, success: (newResource: Contact) => void, error: (e) => void) {
    this.apiService.post<Contact>('/contact/contacts', resource, success, error);
  }
  put(resource: Contact, success: (newResource: Contact) => void, error: (e) => void) {
    this.apiService.put<Contact>('/contact/contacts', resource, success, error);
  }
  delete(id: string, success: (resp) => void, error: (e) => void) {
    this.apiService.delete('/contact/contacts', id, success, error);
  }

}
