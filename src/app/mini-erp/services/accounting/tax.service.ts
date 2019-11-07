import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiResource } from '../api-resoure-interface';
import { TaxModel } from '../../models/accounting/tax.model';

@Injectable({
  providedIn: 'root',
})
export class TaxService implements ApiResource<TaxModel> {

  constructor(private apiService: ApiService) { }

  get(params: Object, success: (resources: TaxModel[]) => void, error: (e) => void) {
    this.apiService.get<TaxModel[]>('/contact/contacts', params, success, error);
  }
  getById(id: string, success: (resources: TaxModel) => void, error: (e) => void) {
    this.apiService.get<TaxModel>('/contact/contacts', { 'id': id }, success, error);
  }
  post(resource: TaxModel, success: (newResource: TaxModel) => void, error: (e) => void) {
    this.apiService.post<TaxModel>('/contact/contacts', resource, success, error);
  }
  put(resource: TaxModel, success: (newResource: TaxModel) => void, error: (e) => void) {
    this.apiService.put<TaxModel>('/contact/contacts', resource, success, error);
  }
  delete(id: string, success: (resp) => void, error: (e) => void) {
    this.apiService.delete('/contact/contacts', id, success, error);
  }

}
