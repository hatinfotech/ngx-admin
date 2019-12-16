import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { PbxModel } from '../../models/pbx.model';
import { PbxDomainModel } from '../../models/pbx-domain.model';

@Injectable({
  providedIn: 'root',
})
export class IvoipService {

  protected domainList: { id?: string, text: string, children: any[] }[] = [];
  protected pbxList: PbxModel[] = [];
  protected activePbx: string;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {

  }

  getPbxList(callback: (pbxList: PbxModel[]) => void, clearCache?: boolean) {
    if (clearCache || this.pbxList.length === 0) {
      this.apiService.get<PbxModel[]>('/ivoip/pbxs', { limit: 999999, includeDomains: true }, list => {
        callback(list);
      });
    } else {
      callback(this.pbxList);
    }
  }

  getActiveDomainList(callback: (domainList: PbxDomainModel[]) => void) {
    this.getPbxList(pbxList => callback(pbxList.filter(item => item.Code === this.getActivePbx())[0].Domains));
  }

  clearCache() {
    this.domainList = [];
  }

  getPbxActiveDomain() {
    return localStorage.getItem('active_pbx_domain');
  }

  setPbxActiveDomain(value: string) {
    localStorage.setItem('active_pbx_domain', value);
  }

  setActivePbx(value: string) {
    localStorage.setItem('active_pbx', value);
  }

  getActivePbx() {
    return localStorage.getItem('active_pbx');
  }

  onChangeDomain(domain: PbxDomainModel) {
    if (domain) {
      this.setPbxActiveDomain(domain.DomainUuid);
      this.setActivePbx(domain.Pbx);
    }
  }

  onChangePbx(pbx: PbxModel) {
    if (pbx) {
      this.setActivePbx(pbx.Code);
    }
  }

  getDomainListOption() {
    return {
      placeholder: 'Chọn domain...',
      allowClear: false,
      width: '100%',
      dropdownAutoWidth: true,
      minimumInputLength: 0,
      keyMap: {
        id: 'DomainUuid',
        text: 'DomainName',
      },
    };
  }

  loadDomainList(callback?: (domains: { id?: string, text: string, children: any[] }[]) => void) {
    if (this.domainList.length > 0) {
      callback(this.domainList);
    } else {
      this.getPbxList(pbxList => {
        this.domainList = pbxList.map(pbx => {
          // this.pbxList[pbx.Code] = pbx;
          return {
            text: pbx.Name,
            children: this.commonService.convertOptionList(pbx.Domains, 'DomainUuid', 'DomainName'),
          };
        });
        setTimeout(() => {
          if (callback) callback(this.domainList);
        }, 300);
      });
      // this.apiService.get<PbxModel[]>('/ivoip/pbxs', { limit: 999999, includeDomains: true }, list => {
      //   this.domainList = list.map(pbx => {
      //     this.pbxList[pbx.Code] = pbx;
      //     return {
      //       text: pbx.Name,
      //       children: this.commonService.convertOptionList(pbx.Domains, 'DomainUuid', 'DomainName'),
      //     };
      //   });
      //   setTimeout(() => {
      //     if (callback) callback(this.domainList);
      //   }, 300);

      // });
    }
  }

}
