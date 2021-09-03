import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { PbxModel } from '../../models/pbx.model';
import { PbxDomainModel } from '../../models/pbx-domain.model';
import { NbAuthService } from '@nebular/auth';

export class PbxDomainSelection {
  id?: string;
  text: string;
  children?: {
    id: string,
    text: string,
    domain: PbxDomainModel,
  }[];
}

@Injectable(
  { providedIn: 'root' },
)
export class IvoipService {

  protected domainList: PbxDomainSelection[] = [];
  protected pbxList: PbxModel[] = [];
  protected activePbx: string;
  activeDomainUuid: string;
  // protected _activeDomainUuid: string;

  constructor(
    private apiService: ApiService,
    private authService: NbAuthService,
  ) {
    // this.activeDomainUuid = localStorage.getItem('active_pbx_domain');
    // this._activeDomainUuid = this.getPbxActiveDomainUuid();
    // this.getPbxActiveDomainUuid();
    this.authService.onAuthenticationChange().subscribe(state => {
      if (state) {
        // this.loadDomainList();
      } else {
        this.clearCache();
      }
    });
  }

  getDomainList(callback: (domainList: PbxDomainSelection[]) => void) {
    this.loadDomainList(domainList => {
      callback(this.domainList);
    });

  }

  getPbxList(callback: (pbxList: PbxModel[]) => void, clearCache?: boolean) {
    if (clearCache || !this.pbxList || this.pbxList.length === 0) {
      this.apiService.getPromise<PbxModel[]>('/ivoip/pbxs', { limit: 999999, includeDomains: true, silent: true }).then(list => {
        this.pbxList = list;
        callback(this.pbxList);
        this.setFirstDomainAsActivated();
      });
    } else {
      callback(this.pbxList);
      this.setFirstDomainAsActivated();
    }
  }

  setFirstDomainAsActivated() {
    if (!this.getPbxActiveDomainUuid() && this.pbxList && this.pbxList[0] && this.pbxList[0].Domains && this.pbxList[0].Domains[0]) {
      this.setPbxActiveDomain(this.pbxList[0].Domains[0].DomainUuid);
      this.setActivePbx(this.pbxList[0].Code);
    }
  }

  getActiveDomainList(callback: (domainList: { id: string, text: string, domain: PbxDomainModel }[]) => void) {
    this.getPbxList(pbxList => {
      const pbx = pbxList.filter(item => item.Code === this.getActivePbx())[0];
      let domains = [];
      if (pbx && pbx.Domains) {
        domains = pbx.Domains.map(domain => {
          return {
            id: domain.DomainId,
            text: domain.DomainName,
            domain: domain,
          };
        });
      }
      callback(domains);
    });
  }

  clearCache() {
    this.domainList = [];
    this.setActivePbx('');
    this.setPbxActiveDomain('');
  }

  getPbxActiveDomainUuid() {
    if (!this.activeDomainUuid) {
      this.activeDomainUuid = localStorage.getItem('active_pbx_domain');
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
      if (domainModel) {
        this.setPbxActiveDomain(domainModel.DomainUuid);
        this.setActivePbx(domainModel.Pbx);
      }
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
      }
    } else {
      const activeDomainUuid = this.getPbxActiveDomainUuid();
      // let isFirst = true;
      this.getPbxList(pbxList => {
        this.domainList = pbxList.map(pbx => {
          return {
            text: pbx.Name,
            children: pbx.Domains.map(domain => {
              const result = {
                id: domain.DomainUuid,
                text: domain.DomainName,
                selected: domain.DomainUuid === activeDomainUuid,
                domain: domain,
              };
              return result;
            }),
          };
        });
        if (callback) callback(this.domainList);
        // setTimeout(() => {
        //   if (callback) {
        //     const activeDomain_Uuid = this.getPbxActiveDomainUuid();
        //     this.setPbxActiveDomain('');
        //     this.setPbxActiveDomain(activeDomain_Uuid);
        //   }
        // }, 300);
      });
    }
  }

}
