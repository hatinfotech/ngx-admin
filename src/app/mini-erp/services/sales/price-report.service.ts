import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiResource } from '../api-resoure-interface';
import { PriceReport } from '../../models/sales/price-report.model';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PriceReportService implements ApiResource<PriceReport> {

  constructor(private apiService: ApiService) { }

  get(params: Object, success: (resources: PriceReport[]) => void, error: (e) => void) {
    this.apiService.get<PriceReport[]>('/sales/price-reports', params, success, error);
  }
  post(resource: PriceReport, success: (newResource: PriceReport) => void, error: (e) => void) {
    this.apiService.post<PriceReport>('/sales/price-reports', resource, success, error);
  }
  put(resource: PriceReport, success: (newResource: PriceReport) => void, error: (e) => void) {
    this.apiService.put<PriceReport>('/sales/price-reports', resource, success, error);
  }
  delete(id: string, success: (resp) => void, error: (e) => void) {
    this.apiService.delete('/sales/price-reports', id, success, error);
  }

}
