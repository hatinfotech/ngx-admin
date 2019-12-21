import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { PbxModel } from '../../models/pbx.model';
import { PbxDomainModel } from '../../models/pbx-domain.model';
import { isString } from 'util';

export class PbxDomainSelection {
  id?: string;
  text: string;
  children?: {
    id: string,
    text: string,
    domain: PbxDomainModel,
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class IvoipService {

  protected domainList: PbxDomainSelection[] = [];
  protected pbxList: PbxModel[] = [];
  protected activePbx: string;
  activeDomainUuid: string;
  // protected _activeDomainUuid: string;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {
    // this.activeDomainUuid = localStorage.getItem('active_pbx_domain');
    // this._activeDomainUuid = this.getPbxActiveDomainUuid();
  }

  getDomainList(callback: (domainList: PbxDomainSelection[]) => void) {
    this.loadDomainList(domainList => {
      callback(this.domainList);
    });

  }

  getPbxList(callback: (pbxList: PbxModel[]) => void, clearCache?: boolean) {
    if (clearCache || this.pbxList.length === 0) {
      this.apiService.get<PbxModel[]>('/ivoip/pbxs', { limit: 999999, includeDomains: true }, list => {
        this.pbxList = list;
        callback(this.pbxList);
      });
    } else {
      callback(this.pbxList);
    }
  }

  getActiveDomainList(callback: (domainList: { id: string, text: string, domain: PbxDomainModel }[]) => void) {
    this.getPbxList(pbxList => callback(pbxList.filter(item => item.Code === this.getActivePbx())[0].Domains.map(item2 => {
      return {
        id: item2.DomainId,
        text: item2.DomainName,
        domain: item2,
      };
    })));
  }

  clearCache() {
    this.domainList = [];
  }

  getPbxActiveDomainUuid() {
    if (!this.activeDomainUuid) {
      this.activeDomainUuid = localStorage.getItem('active_pbx_domain')
    }
    return this.activeDomainUuid;
    // return localStorage.getItem('active_pbx_domain');
  }

  getActiveDomain() {
    let domainModel: PbxDomainModel;
    this.domainList.forEach(element => {
      if (element.children) {
        const domainChoosed = element.children.find((value) => value.domain.DomainUuid === this.activeDomainUuid);
        if (domainChoosed) {
          domainModel = domainChoosed.domain;
        }
      }
    });
    return domainModel;
  }

  getActiveDomainByUuid(uuid: string) {
    let domainModel: PbxDomainModel;
    this.domainList.forEach(element => {
      if (element.children) {
        const domainChoosed = element.children.find((value) => value.domain.DomainUuid === uuid);
        if (domainChoosed) {
          domainModel = domainChoosed.domain;
        }
      }
    });
    return domainModel;
  }

  getPbxActiveDomainId() {
    return this.getPbxActiveDomainUuid().split('@')[0];
  }

  setPbxActiveDomain(value: string) {
    this.activeDomainUuid = value;
    localStorage.setItem('active_pbx_domain', value);
  }

  setActivePbx(value: string) {
    localStorage.setItem('active_pbx', value);
  }

  getActivePbx() {
    return localStorage.getItem('active_pbx');
  }

  onChangeDomain(domain: string) {
    if (domain) {
      let domainModel: PbxDomainModel;
      this.domainList.forEach(element => {
        if (element.children) {
          const domainChoosed = element.children.find((value) => value.domain.DomainUuid === domain);
          if (domainChoosed) {
            domainModel = domainChoosed.domain;
          }
        }
      });
      this.setPbxActiveDomain(domainModel.DomainUuid);
      this.setActivePbx(domainModel.Pbx);
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

  loadDomainList(callback?: (domains: PbxDomainSelection[]) => void) {
    if (this.domainList.length > 0) {
      if (callback) {
        callback(this.domainList);
        // const activeDomainUuid = this.activeDomainUuid;
        // this.activeDomainUuid = '';
        // this.activeDomainUuid = activeDomainUuid;
      }
    } else {
      this.getPbxList(pbxList => {
        this.domainList = pbxList.map(pbx => {
          // this.pbxList[pbx.Code] = pbx;
          return {
            text: pbx.Name,
            children: pbx.Domains.map(domain => {
              return {
                id: domain.DomainUuid,
                text: domain.DomainName,
                domain: domain,
              };
            }),
          };
        });
        setTimeout(() => {
          if (callback) {
            callback(this.domainList);
            // const activeDomainUuid = this.activeDomainUuid;
            // this.activeDomainUuid = '';
            // this.activeDomainUuid = activeDomainUuid;
          }
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
