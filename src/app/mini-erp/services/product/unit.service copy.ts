import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiResource } from '../api-resoure-interface';
import { PriceReport } from '../../models/sales/price-report.model';
import { Contact } from '../../models/crm/contact';
import { Unit } from '../../models/product/unit.model';

@Injectable({
  providedIn: 'root',
})
export class UnitService implements ApiResource<Unit> {

  constructor(private apiService: ApiService) { }

  get(params: Object, success: (resources: Unit[]) => void, error: (e) => void) {
    this.apiService.get<Unit[]>('/admin-product/units', params, success, error);
  }
  getById(id: string, success: (resources: Unit) => void, error: (e) => void) {
    this.apiService.get<Unit>('/admin-product/units', { 'id': id}, success, error);
  }
  post(resource: Unit, success: (newResource: Unit) => void, error: (e) => void) {
    this.apiService.post<Unit>('/admin-product/units', resource, success, error);
  }
  put(resource: Unit, success: (newResource: Unit) => void, error: (e) => void) {
    this.apiService.put<Unit>('/admin-product/units', resource, success, error);
  }
  delete(id: string, success: (resp) => void, error: (e) => void) {
    this.apiService.delete('/admin-product/units', id, success, error);
  }

}
