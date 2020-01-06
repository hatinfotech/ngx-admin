import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NbAuthService } from '@nebular/auth';
import { WhHostingModel } from '../../models/wh-hosting.model';
import { CommonService } from '../../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class WebHostingService {

  hostingList: WhHostingModel[];
  hostingListConfig = {
    placeholder: 'Chọn hosting...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Host',
    },
  };

  hostingMap: { [key: string]: WhHostingModel } = {};

  constructor(
    private apiService: ApiService,
    private authService: NbAuthService,
    private commonService: CommonService,
  ) {
    this.apiService.get<WhHostingModel[]>('/web-hosting/hostings', {}, hostings => {
      this.hostingList = this.commonService.convertOptionList(hostings, 'Code', 'Host');
      this.hostingList.forEach(hosting => {
        this.hostingMap[hosting.Code] = hosting;
      });
    });
  }

}
