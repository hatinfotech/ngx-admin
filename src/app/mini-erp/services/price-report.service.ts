import { DataServiceService } from './data-service.service';
import { HttpResponse } from '@angular/common/http';
import { PriceReportModel } from '../models/sales/price-report.model';

export class PriceReportService extends DataServiceService {

  getPriceReports(sucess: (priceReports: PriceReportModel[]) => void, error: (arg0: any) => void) {

    this._http.get<HttpResponse<any>>(this.buildApiUrl('/sales/price-reports'), { observe: 'response' })
      .subscribe((resp: HttpResponse<any>) => {
        // const session = resp.headers.get('session');
        // if (session) {
        //   this.storeSession(session);
        // }
        sucess(resp.body);
      }, (e) => {
        error(e.error);
      });
  }

}
