import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiResource } from '../api-resoure-interface';
import { ContactModel } from '../../models/crm/contact.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements ApiResource<ContactModel> {

  constructor(private apiService: ApiService) { }

  get(params: Object, success: (resources: ContactModel[]) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.get<ContactModel[]>('/contact/contacts', params, success, error);
  }
  getById(id: string, success: (resources: ContactModel) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.get<ContactModel>('/contact/contacts', { 'id': id}, success, error);
  }
  post(resource: ContactModel, success: (newResource: ContactModel) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.post<ContactModel>('/contact/contacts', resource, success, error);
  }
  put(resource: ContactModel, success: (newResource: ContactModel) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.put<ContactModel>('/contact/contacts', resource, success, error);
  }
  delete(id: string, success: (resp) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.delete('/contact/contacts', id, success, error);
  }

}
