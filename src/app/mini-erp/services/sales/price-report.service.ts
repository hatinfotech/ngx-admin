import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiResource } from '../api-resoure-interface';
import { PriceReportModel } from '../../models/sales/price-report.model';
import { catchError, retry } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PriceReportService implements ApiResource<PriceReportModel> {

  constructor(private apiService: ApiService) { }

  get(params: Object, success: (resources: PriceReportModel[]) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.get<PriceReportModel[]>('/sales/price-reports', params, success, error);
  }
  getById(id: string, success: (resources: PriceReportModel) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.get<PriceReportModel>('/sales/price-reports', { 'id': id}, success, error);
  }
  post(resource: PriceReportModel, success: (newResource: PriceReportModel) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.post<PriceReportModel>('/sales/price-reports', resource, success, error);
  }
  put(resource: PriceReportModel, success: (newResource: PriceReportModel) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.put<PriceReportModel>('/sales/price-reports', resource.Code, resource, success, error);
  }
  delete(id: string, success: (resp) => void, error: (e: HttpErrorResponse) => void) {
    this.apiService.delete('/sales/price-reports', id, success, error);
  }

}
