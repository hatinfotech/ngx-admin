import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { PbxModel } from '../../models/pbx.model';

@Injectable({
  providedIn: 'root',
})
export class IvoipService {

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {

  }

  getPbxActiveDomain() {
    return localStorage.getItem('active_pbx_domain');
  }

  setPbxActiveDomain(value: string) {
    localStorage.setItem('active_pbx_domain', value);
  }

  getDomainListOption() {
    return {
      placeholder: 'Chọn domain...',
      allowClear: false,
      width: '100%',
      dropdownAutoWidth: true,
      minimumInputLength: 0,
      keyMap: {
        id: 'DomainId',
        text: 'DomainName',
      },
    };
  }

  loadDomainList(callback?: (domains: { id?: string, text: string, children: any[] }[]) => void) {
    this.apiService.get<PbxModel[]>('/ivoip/pbxs', { limit: 999999, includeDomains: true }, list => {
      const domainList = list.map(pbx => {
        return {
          text: pbx.Name,
          children: this.commonService.convertOptionList(pbx.Domains, 'DomainId', 'DomainName'),
        };
      });
      setTimeout(() => {
        // this.activePbxDoamin = this.getPbxActiveDomain();
        // super.ngOnInit();
        if (callback) callback(domainList);
      }, 300);

    });
  }

}
