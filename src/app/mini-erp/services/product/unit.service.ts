import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiResource } from '../api-resoure-interface';
import { UnitModel } from '../../models/product/unit.model';

@Injectable({
  providedIn: 'root',
})
export class UnitService implements ApiResource<UnitModel> {

  constructor(private apiService: ApiService) { }

  get(params: Object, success: (resources: UnitModel[]) => void, error: (e) => void) {
    this.apiService.get<UnitModel[]>('/admin-product/units', params, success, error);
  }
  getById(id: string, success: (resources: UnitModel) => void, error: (e) => void) {
    this.apiService.get<UnitModel>('/admin-product/units', { 'id': id}, success, error);
  }
  post(resource: UnitModel, success: (newResource: UnitModel) => void, error: (e) => void) {
    this.apiService.post<UnitModel>('/admin-product/units', resource, success, error);
  }
  put(resource: UnitModel, success: (newResource: UnitModel) => void, error: (e) => void) {
    this.apiService.put<UnitModel>('/admin-product/units', resource, success, error);
  }
  delete(id: string, success: (resp) => void, error: (e) => void) {
    this.apiService.delete('/admin-product/units', id, success, error);
  }

}
