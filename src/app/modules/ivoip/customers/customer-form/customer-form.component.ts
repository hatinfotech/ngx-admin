import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxCustomerModel } from '../../../../models/pbx-customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbGlobalPhysicalPosition, NbToastRef, NbComponentStatus } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxGatewayModel } from '../../../../models/pbx-gateway.model';
import { PbxModel } from '../../../../models/pbx.model';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { UserModel } from '../../../../models/user.model';
import { PbxPstnNumberModel } from '../../../../models/pbx-pstn-number.model';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { PbxDialplanModel } from '../../../../models/pbx-dialplan.model';
import { WhWebsiteModel } from '../../../../models/wh-website.model';
import { WhDatabaseUserModel } from '../../../../models/wh-database-user.model';
import { WhDatabaseModel } from '../../../../models/wh-database.model';
import { WhFtpModel } from '../../../../models/wh-ftp.model';
import { MiniErpDeploymentModel } from '../../../../models/minierp-deployment.model';
import { WhHostingModel } from '../../../../models/wh-hosting.model';
import { PbxUserModel } from '../../../../models/pbx-user.model';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { PbxDeploymentModel } from '../../../../models/pbx-deployment.model';

export class Executable {
  message: string;
  title?: string;
  icon?: string;
  iconPack?: string;
  status?: '' | NbComponentStatus;
  durarion?: number;
  maxTry: number;
  delayTry: number;
  execute: () => Promise<boolean>;
}

@Component({
  selector: 'ngx-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent extends IvoipBaseFormComponent<PbxCustomerModel> implements OnInit {

  componentName: string = 'CallBlockFormComponent';
  idKey = 'Code';
  apiPath = '/ivoip/customers';
  baseFormUrl = '/ivoip/customers/form';

  gatewaylist: { id: string, text: string }[];
  longToastRef: NbToastRef = null;

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public ivoipService: IvoipService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ivoipService);
  }

  progressBarValue = 10;
  processBarlabel = 'Tiến trình';

  pbxList: PbxModel[] = [];
  select2OptionForPbxList = {
    placeholder: 'Chọn tổng đài...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Description',
    },
  };

  hostingList: { Code: string, Name: string }[] = [];
  hostingListConfig = {
    placeholder: 'Chọn web hosting...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Host',
    },
  };

  ngOnInit() {
    this.restrict();

    // this.apiService.get<PbxGatewayModel[]>('/ivoip/gateways', { domainId: this.ivoipService.getPbxActiveDomainUuid() }, gateways => {

    // this.gatewaylist = gateways.map(item => {
    //   return { id: item.gateway_uuid, text: item.gateway };
    // });

    this.apiService.get<PbxModel[]>('/ivoip/pbxs', { select: 'Code,Description,ApiUrl', limit: 9999 }, list => {
      this.pbxList = this.convertOptionList(list, 'Code', 'Description');

      this.apiService.get<WhHostingModel[]>('/web-hosting/hostings', {}, hostings => {
        this.hostingList = this.convertOptionList(hostings, 'Code', 'Host');
        super.ngOnInit();

        let checked = false;
        this.form.valueChanges.subscribe(values => {
          if (this.form.valid) {
            if (!checked) {
              this.progressBarValue = 30;
              this.processBarlabel = 'Khai báo thông tin';
              checked = true;
            }
          }
        });
      });

    });

    // });

  }

  get progressBarStatus() {
    if (this.progressBarValue <= 25) {
      return 'danger';
    } else if (this.progressBarValue <= 50) {
      return 'warning';
    } else if (this.progressBarValue <= 75) {
      return 'info';
    } else {
      return 'success';
    }
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxCustomerModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeIvoipDeployment'] = true;
    params['includeMiniErpDeployment'] = true;
    super.executeGet(params, data => {
      if (data && data[0]) {
        if (data[0]['Pbx']) {
          this.apiService.get<PbxGatewayModel[]>('/ivoip/gateways', { pbx: data[0]['Pbx'] }, gateways => {

            this.gatewaylist = gateways.map(g => {
              return { id: g.gateway_uuid, text: g.gateway };
            });

            success(data);

          });
        } else {
          success(data);
        }
      }

    }, error);
  }

  makeNewFormGroup(data?: PbxCustomerModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Phone: ['', Validators.required],
      Email: ['', Validators.required],
      Address: [''],
      Note: [''],
      // Pbx info
      Pbx: ['', Validators.required],
      DomainName: ['', Validators.required],
      PstnNumber: [''],
      Gateway: [''],
      Extensions: ['', Validators.required],
      PrivatePbxNumber: [''],
      Hosting: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxCustomerModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/customers/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }


  onAfterCreateSubmit(newFormData: PbxCustomerModel[]) {
    // super.onAfterCreateSubmit(newFormData);
    super.onAfterCreateSubmit(newFormData);
    this.deployPbxAndMiniErp(newFormData, () => {
      this.onProcessed();
      // this.dialogService.open(ShowcaseDialogComponent, {
      //   context: {
      //     title: 'Triển khai Tổng Đài Điện Toán',
      //     content: 'Hoàn tất triển khai Tổng Đài Điện Toán',
      //     actions: [{ label: 'Ok', icon: 'back', status: 'success', action: () => { } }],
      //   },
      // });
    }, e => {
      this.onProcessed();
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Lỗi triển khai Tổng Đài Điện Toán',
          content: e && e.error && e.error.logs ? e.error.logs.join('\n') : JSON.stringify(e),
          actions: [
            { label: 'Đóng', icon: 'back', status: 'info', action: () => { } },
            // {
            //   label: 'Chi tiết', icon: 'ok', status: 'warning', action: () => {
            //     this.dialogService.open(ShowcaseDialogComponent, {
            //       context: {
            //         title: 'Lỗi triển khai Tổng Đài Điện Toán',
            //         content: e && e.error && e.error.logs ? e.error.logs.join('<br>') : JSON.stringify(e),
            //         actions: [
            //           { label: 'Đóng', icon: 'back', status: 'info', action: () => { } },
            //         ],
            //       },
            //     });
            //   },
            // },
          ],
        },
      });
    });
  }

  onAfterUpdateSubmit(newFormData: PbxCustomerModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    this.deployPbxAndMiniErp(newFormData, () => {
      this.onProcessed();
      // this.dialogService.open(ShowcaseDialogComponent, {
      //   context: {
      //     title: 'Triển khai Tổng Đài Điện Toán',
      //     content: 'Hoàn tất triển khai Tổng Đài Điện Toán',
      //     actions: [{ label: 'Ok', icon: 'back', status: 'success', action: () => { } }],
      //   },
      // });
    }, e => {
      this.onProcessed();
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Lỗi triển khai Tổng Đài Điện Toán',
          content: e && e.error && e.error.logs ? e.error.logs.join('\n') : JSON.stringify(e),
          actions: [
            { label: 'Đóng', icon: 'back', status: 'info', action: () => { } },
            // {
            //   label: 'Chi tiết', icon: 'ok', status: 'warning', action: () => {
            //     this.dialogService.open(ShowcaseDialogComponent, {
            //       context: {
            //         title: 'Lỗi triển khai Tổng Đài Điện Toán',
            //         content: e && e.error && e.error.logs ? e.error.logs.join('<br>') : JSON.stringify(e),
            //         actions: [
            //           { label: 'Đóng', icon: 'back', status: 'info', action: () => { } },
            //         ],
            //       },
            //     });
            //   },
            // },
          ],
        },
      });
    });
  }

  async deployPbxPbxUser(pbx: string, domainId: string, givenName: string, familyName: string, organization: string, email: string, groups: string[], username: string) {
    return new Promise<PbxUserModel>((resolve, reject) => {
      this.apiService.get<PbxUserModel[]>('/ivoip/users', { username: username, domainId: domainId + '@' + pbx, silent: true }, oldPbxUsers => {
        let pbxUser: PbxUserModel = null;
        let method = 'POST';
        if (oldPbxUsers.length > 0) {
          pbxUser = oldPbxUsers[0];
          method = 'PUT';
        } else {
          pbxUser = new PbxUserModel();
        }

        pbxUser.username = username;
        pbxUser.user_email = email;
        pbxUser.contact_name_given = givenName;
        pbxUser.contact_name_family = familyName;
        pbxUser.contact_organization = organization;
        pbxUser.domain_uuid = domainId;
        pbxUser.groups = groups;
        pbxUser.user_enabled = true;

        this.apiService.postPut<PbxUserModel[]>(method, '/ivoip/users', { domainId: domainId + '@' + pbx, autoGeneratePassword: true, autoGenerateApiKey: true, silent: true }, [pbxUser], newPbxUsers => {
          if (newPbxUsers && newPbxUsers.length > 0) {

            // Notify
            this.toastrService.show('success', 'Đã tạo thông tin kêt nối api cho tổng đài', {
              status: 'success',
              hasIcon: true,
              position: NbGlobalPhysicalPosition.TOP_RIGHT,
            });

            resolve(newPbxUsers[0]);
          } else {
            reject('Lỗi tạo thông tin kết nối api cho tổng đài');
          }
        }, e => reject(e));
      }, e => reject(e));
    });
  }

  async deployPbxDomain(pbx: string, domainName: string, description: string, silent: boolean) {
    return new Promise<PbxDomainModel>((resolve, reject) => {
      const domain = new PbxDomainModel();
      this.apiService.get<PbxDomainModel[]>('/ivoip/domains', { DomainName: domainName, silent: true }, domains => {

        if (domains.length > 0) {
          resolve(domains[0]);
        } else {
          // Create domain and assign user to owner domain
          domain.Pbx = pbx;
          domain.DomainName = domainName;
          domain.Description = description;

          this.apiService.post<PbxDomainModel[]>('/ivoip/domains', { silent: silent }, [domain], newDomains => {
            const newDomain = newDomains[0];
            if (newDomain) {
              // Notify
              this.toastrService.show('success', 'Khởi tạo tổng đài thành công', {
                status: 'success',
                hasIcon: true,
                position: NbGlobalPhysicalPosition.TOP_RIGHT,
              });
              resolve(newDomain);
            } else {
              reject('Hệ thống không thể khởi tạo tổng đài');
            }

          }, e => reject(e));
        }
      });
    });
  }

  async updatePbxDomainCache(pbx: PbxModel) {
    return new Promise<PbxModel[] | HttpErrorResponse>((resolve, reject) => {
      /** Sync pbx domains and get current pbx doamins */
      this.apiService.put<PbxModel[]>('/ivoip/pbxs', { cachePbxDomain: true, silent: true }, [pbx], pbxs => { }, null, resp => {
        resolve(resp);
      });
    });

  }

  async deployPbxPstnNumber(pbx: string, domainId: string, domainName: string, pstnNumberStr: string, transferToExt: string) {
    return new Promise<PbxPstnNumberModel>((resolve, reject) => {
      this.apiService.get<PbxPstnNumberModel[]>('/ivoip/pstn-numbers', { domainId: domainId + '@' + pbx, destination_accountcode: pstnNumberStr, silent: true }, oldPstnNumbers => {
        if (oldPstnNumbers.length > 0) {
          resolve(oldPstnNumbers[0]);
        } else {
          const pstnNumber = new PbxPstnNumberModel();
          pstnNumber.destination_accountcode = pstnNumberStr;
          pstnNumber.destination_number = '(\\d{1,3}' + pstnNumberStr.replace(/^0/, '') + ')';
          pstnNumber.domain_uuid = domainId;
          pstnNumber.destination_type = 'inbound';
          pstnNumber.destination_description = 'Goi vao';
          pstnNumber.destination_record = true;
          pstnNumber.destination_enabled = true;
          pstnNumber.dialplan_details = [
            {
              dialplan_detail_data: 'transfer:' + transferToExt + ' XML ' + domainName,
            },
          ];

          this.apiService.post<PbxPstnNumberModel[]>('/ivoip/pstn-numbers', { domainId: domainId + '@' + pbx, silent: true }, [pstnNumber], newPstnNumbers => {
            const newPstnNumber = newPstnNumbers[0];

            if (newPstnNumber) {

              this.toastrService.show('success', 'Đã khai báo số đấu nối', {
                status: 'success',
                hasIcon: true,
                position: NbGlobalPhysicalPosition.TOP_RIGHT,
              });

              resolve(newPstnNumber);
            } else {
              reject('Lỗi khai báo số đấu nối');
            }
          }, e => reject(e));
        }
      }, e => reject(e));
    });
  }

  async deployPbxExtensions(pbx: string, domainId: string, domainName: string, extensionsStr: string) {
    return new Promise<PbxExtensionModel[]>((resolve, reject) => {
      // Config pstn number
      let exts: string[] = [];
      let minExtension: string;
      let maxExtension: string;
      let firstExtension: string;
      if (/\,/.test(extensionsStr)) {
        exts = extensionsStr.split(',');
        firstExtension = exts[0];
      } else {
        const tmpList = extensionsStr.split('-');
        if (tmpList.length > 1) {
          minExtension = tmpList[0];
          maxExtension = tmpList[1];
          firstExtension = minExtension;

          for (let i = +minExtension; i <= +maxExtension; i++) {
            exts.push('' + i);
          }
        } else if (tmpList[0]) {
          exts.push('' + tmpList[0]);
        }
      }

      const extensions: PbxExtensionModel[] = [];
      exts.forEach(ext => {
        extensions.push({
          extension: ext,
          call_timeout: 30,
          enabled: true,
          password: '',
          domain_uuid: domainId,
          user_record: 'all',
          description: ext + '@' + domainName.split('.')[0],
        });
      });

      this.apiService.get<PbxExtensionModel[]>('/ivoip/extensions', { domainId: domainId + '@' + pbx, silent: true }, oldExtensions => {
        if (oldExtensions.length > 0) {
          resolve(oldExtensions);
        } else {
          if (extensions.length > 0) {
            this.apiService.post<PbxExtensionModel[]>('/ivoip/extensions', { domainId: domainId + '@' + pbx, silent: true }, extensions, newExtensions => {
              if (newExtensions && newExtensions.length > 0) {
                this.toastrService.show('success', 'Đã khai báo danh sách số mở rộng', {
                  status: 'success',
                  hasIcon: true,
                  position: NbGlobalPhysicalPosition.TOP_RIGHT,
                });

                resolve(newExtensions);
              } else {
                reject('Lỗi khai báo danh sách số mở rộng');
              }
            }, e => reject(e));
          } else {
            resolve([]);
          }
        }
      }, e => reject(e));
    });
  }

  async deployPbxOutboundRule(pbx: string, domainId: string, domainName, pstnNumberStr: string, gateway: string) {
    return new Promise<PbxDialplanModel>((resolve, reject) => {

      // Create outbound route
      const dialplan = new PbxDialplanModel();
      dialplan.dialplan_type = 'outbound';
      dialplan.dialplan_gateway = gateway;
      dialplan.dialplan_name = 'Goi ra ' + pstnNumberStr;
      dialplan.dialplan_number = pstnNumberStr;
      dialplan.dialplan_regex = '\d{7,12}';
      dialplan.dialplan_context = domainName;
      dialplan.domain_uuid = domainId;
      dialplan.dialplan_description = 'Goi ra ' + pstnNumberStr;
      dialplan.dialplan_order = 100;
      dialplan.dialplan_enabled = true;

      this.apiService.post<PbxDialplanModel[]>('/ivoip/dialplans', { domainId: domainId + '@' + pbx, silent: true }, [dialplan], newDialplans => {

        if (newDialplans && newDialplans.length > 0) {

          this.toastrService.show('success', 'Đã thêm cấu hình gọi ra', {
            status: 'success',
            hasIcon: true,
            position: NbGlobalPhysicalPosition.TOP_RIGHT,
          });

          resolve(dialplan);
        } else {
          reject('Lỗi thêm cấu hình gọi ra');
        }

      }, e => reject(e));
    });
  }

  async deployMiniErpWebiste(hosting: string, domainName: string) {
    return new Promise<WhWebsiteModel>((resolve, reject) => {

      this.apiService.get<WhWebsiteModel[]>('/web-hosting/websites', { hosting: hosting, domain: domainName, silent: true }, oldWebsites => {

        let website = oldWebsites[0];
        let menthod = 'POST';
        if (website) {
          menthod = 'PUT';
        } else {
          website = new WhWebsiteModel();
        }

        website.hosting = hosting;
        website.domain = domainName;

        this.apiService.postPut<WhWebsiteModel[]>(menthod, '/web-hosting/websites', { hosting: hosting }, [website], newWebsites => {
          const newWebsite = newWebsites[0];
          if (newWebsite) {

            this.toastrService.show('success', 'Đã khởi tạo website', {
              status: 'success',
              hasIcon: true,
              position: NbGlobalPhysicalPosition.TOP_RIGHT,
            });
            resolve(newWebsite);
          } else {
            reject('Lỗi khởi tạo website');
          }
        }, e => reject(e));
      }, e => reject(e));

    });
  }

  async deployMiniErpDatabaseUser(hosting: string, clientId: string, username: string) {
    return new Promise<WhDatabaseUserModel>((resolve, reject) => {

      const dbUsername = 'c' + clientId + username;
      this.apiService.get<WhDatabaseUserModel[]>('/web-hosting/database-users', { hosting: hosting, database_user: dbUsername, silent: true }, oldDbUsers => {
        let dbUser = oldDbUsers[0];
        let method = 'POST';
        if (dbUser) {
          method = 'PUT';
        } else {
          dbUser = new WhDatabaseUserModel();
        }

        dbUser.database_user = dbUsername;
        this.apiService.postPut<WhDatabaseUserModel[]>(method, '/web-hosting/database-users', { hosting: hosting, autoGeneratePassword: true, silent: true }, [dbUser], newDbUsers => {
          const newDbUser = newDbUsers[0];
          if (newDbUser) {

            // Notify
            this.toastrService.show('success', 'Đã khao báo website database user', {
              status: 'success',
              hasIcon: true,
              position: NbGlobalPhysicalPosition.TOP_RIGHT,
            });

            resolve(newDbUser);
          } else {
            reject('Lỗi tại tài khoản database cho website');
          }
        }, e => reject(e));
      }, e => reject(e));
    });
  }

  async deployMiniErpDatabase(hosting: string, websiteId: string, clientId: string, dbUserId: string, dbName: string) {
    return new Promise<WhDatabaseModel>((resolve, reject) => {
      const database = new WhDatabaseModel();
      database.parent_domain_id = websiteId;
      database.database_user_id = dbUserId;
      database.database_name = 'c' + clientId + dbName;

      this.apiService.get<WhDatabaseModel[]>('/web-hosting/databases', { hosting: hosting, database_name: database.database_name, silent: true }, oldDatabases => {
        const oldDatabase = oldDatabases[0];
        if (oldDatabase) {
          resolve(oldDatabase);
        } else {
          this.apiService.post<WhDatabaseModel[]>('/web-hosting/databases', { hosting: hosting, silent: true }, [database], newDatabases => {
            const newDatabase = newDatabases[0];
            if (newDatabase) {

              // Notify
              this.toastrService.show('success', 'Đã khao báo website database', {
                status: 'success',
                hasIcon: true,
                position: NbGlobalPhysicalPosition.TOP_RIGHT,
              });

              resolve(newDatabase);
            } else {
              reject('Lỗi tạo database cho website');
            }
          }, e => reject(e));
        }
      }, e => reject(e));
    });

  }

  async deployMiniErpFtp(hosting: string, clientName: string, websiteId: string, username: string) {
    return new Promise<WhFtpModel>((resolve, reject) => {

      const ftpUser = clientName + username;
      this.apiService.get<WhFtpModel[]>('/web-hosting/ftps', { hosting: hosting, username: ftpUser, silent: true }, oldFtps => {

        let ftp = oldFtps[0];
        let method = 'POST';
        if (ftp) {
          method = 'PUT';
        } else {
          ftp = new WhFtpModel();
        }

        ftp.parent_domain_id = websiteId;
        ftp.username = username;
        this.apiService.postPut<WhFtpModel[]>(method, '/web-hosting/ftps', { hosting: hosting, autoGeneratePassword: true, silent: true }, [ftp], newFtps => {

          const newFtp = newFtps[0];
          if (newFtp) {
            // Update new passowrd to deployment

            this.toastrService.show('success', 'Đã tạo thông tin đăng nhập FTP', {
              status: 'success',
              hasIcon: true,
              position: NbGlobalPhysicalPosition.TOP_RIGHT,
            });

            resolve(newFtp);
          } else {
            reject('Lỗi tạo tài khoản FTP cho webiste');
          }
        }, e => reject(e));
        // }
      }, e => reject(e));
    });
  }

  async deployPbx(customer: string, silent: boolean) {
    return new Promise<PbxDeploymentModel>((resovle, reject) => {

      this.apiService.get<PbxDeploymentModel[]>('/ivoip/deployments', { customer: customer, silent: true }, ivoipDeployments => {
        if (ivoipDeployments && ivoipDeployments.length > 0) {
          const ivoipDeployment = ivoipDeployments[0];

          this.apiService.put<MiniErpDeploymentModel[]>('/mini-erp/deployments', { deploy: true, silent: silent }, [ivoipDeployment], newPbxDeployments => {
            resovle(newPbxDeployments[0]);
          }, e => reject(e));

        } else {
          reject('Pbx deploy ment was not declare');
        }
      });

    });
  }

  async deployMiniErpCore(customer: string, silent: boolean) {
    return new Promise<MiniErpDeploymentModel>((resolve, reject) => {

      this.apiService.get<MiniErpDeploymentModel[]>('/mini-erp/deployments', { customer: customer, silent: true }, miniErpDeployments => {
        if (miniErpDeployments.length > 0) {

          const miniErpDeployment = miniErpDeployments[0];
          this.apiService.put<MiniErpDeploymentModel[]>('/mini-erp/deployments', { deploy: true, silent: true }, [miniErpDeployment], results => {
            resolve(results[0]);
          }, e => {
            reject(e);
          });

        } else {
          reject('Thông tin triển khai Mini ERP không tồn tại');
        }
      }, e => reject(e));
    });
  }

  async checkFtpReady(miniErpDeploymentCode: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.get<boolean>('/mini-erp/deployments', { id: miniErpDeploymentCode, checkFtpReady: true, silent: true }, status => {

        this.toastrService.show('success', 'Kết nối FTP đã sẵn sàn', {
          status: 'success',
          hasIcon: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
        });

        resolve(status);
      }, e => reject(e));
    });
  }

  async uploadMiniErpInstaller(miniErpDeploymentCode: string) {
    return new Promise<MiniErpDeploymentModel>((resolve, reject) => {
      this.apiService.get<MiniErpDeploymentModel[]>('/mini-erp/deployments', { id: miniErpDeploymentCode, silent: true }, miniErpDeployments => {
        this.apiService.put<MiniErpDeploymentModel[]>('/mini-erp/deployments', { id: miniErpDeploymentCode, uploadMiniErpInstaller: true, silent: true }, miniErpDeployments, respMiniErpDeployments => {
          if (respMiniErpDeployments && respMiniErpDeployments.length > 0) {

            this.toastrService.show('success', 'Đã tải bộ cài Mini ERP lên hosting', {
              status: 'success',
              hasIcon: true,
              position: NbGlobalPhysicalPosition.TOP_RIGHT,
            });

            resolve(respMiniErpDeployments[0]);
          } else {
            reject('Lỗi upload bộ cài Mini ERP');
          }
        }, e => reject(e));
      }, e => reject(e));
    });
  }

  async checkDomainReady(miniErpDeploymentCode: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.get<boolean>('/mini-erp/deployments', { id: miniErpDeploymentCode, checkDomainReady: true, silent: true }, status => {

        this.toastrService.show('success', 'Website đã online', {
          status: 'success',
          hasIcon: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
        });

        resolve(status);
      }, e => reject(e));
    });
  }

  async extractMiniErpInstaller(miniErpDeploymentCode: string) {
    return new Promise<MiniErpDeploymentModel>((resolve, reject) => {
      this.apiService.get<MiniErpDeploymentModel[]>('/mini-erp/deployments', { id: miniErpDeploymentCode, silent: true }, miniErpDeployments => {
        this.apiService.put<MiniErpDeploymentModel[]>('/mini-erp/deployments', { id: miniErpDeploymentCode, extractMiniErpInstaller: true, silent: true }, miniErpDeployments, respMiniErpDeployments => {
          if (respMiniErpDeployments && respMiniErpDeployments.length > 0) {
            this.toastrService.show('success', 'Đã giải nén bộ cài Mini ERP', {
              status: 'success',
              hasIcon: true,
              position: NbGlobalPhysicalPosition.TOP_RIGHT,
            });

            resolve(respMiniErpDeployments[0]);
          } else {
            reject('Lỗi giải nến bộ cài Mini ERP');
          }
        }, e => reject(e));
      }, e => reject(e));
    });
  }

  async configMiniErp(miniErpDeploymentCode: string) {
    return new Promise<MiniErpDeploymentModel>((resolve, reject) => {
      this.apiService.get<MiniErpDeploymentModel[]>('/mini-erp/deployments', { id: miniErpDeploymentCode, silent: true }, miniErpDeployments => {
        this.apiService.put<MiniErpDeploymentModel[]>('/mini-erp/deployments', { id: miniErpDeploymentCode, configMiniErp: true, silent: true }, miniErpDeployments, respMiniErpDeployments => {
          if (respMiniErpDeployments && respMiniErpDeployments.length > 0) {
            this.toastrService.show('success', 'Đã cấu hình căn bản cho Mini ERP', {
              status: 'success',
              hasIcon: true,
              position: NbGlobalPhysicalPosition.TOP_RIGHT,
            });

            resolve(respMiniErpDeployments[0]);
          } else {
            reject('Lỗi cấu hình Mini ERP');
          }
        }, e => reject(e));
      }, e => reject(e));
    });
  }

  async configUserForMiniErp(miniErpDeploymentCode: string) {
    return new Promise<MiniErpDeploymentModel>((resolve, reject) => {
      this.apiService.get<MiniErpDeploymentModel[]>('/mini-erp/deployments', { id: miniErpDeploymentCode, silent: true }, miniErpDeployments => {
        this.apiService.put<MiniErpDeploymentModel[]>('/mini-erp/deployments', { id: miniErpDeploymentCode, configUserForMiniErp: true, silent: true }, miniErpDeployments, respMiniErpDeployments => {
          if (respMiniErpDeployments && respMiniErpDeployments.length > 0) {
            this.toastrService.show('success', 'Đã khởi tạo tài khoản admin cho Mini ERP', {
              status: 'success',
              hasIcon: true,
              position: NbGlobalPhysicalPosition.TOP_RIGHT,
            });

            resolve(respMiniErpDeployments[0]);
          } else {
            reject('Lỗi khởi tạo tài khoản admin cho Mini ERP');
          }
        }, e => reject(e));
      }, e => reject(e));
    });
  }

  async cleanMiniErpInstaller(miniErpDeploymentCode: string) {
    return new Promise<MiniErpDeploymentModel>((resolve, reject) => {
      this.apiService.get<MiniErpDeploymentModel[]>('/mini-erp/deployments', { id: miniErpDeploymentCode, silent: true }, miniErpDeployments => {
        this.apiService.put<MiniErpDeploymentModel[]>('/mini-erp/deployments', { id: miniErpDeploymentCode, cleanMiniErpInstaller: true, silent: true }, miniErpDeployments, respMiniErpDeployments => {

          this.toastrService.show('success', 'Đã dọn dẹp các file cài đặt Mini ERP', {
            status: 'success',
            hasIcon: true,
            position: NbGlobalPhysicalPosition.TOP_RIGHT,
          });

          resolve(respMiniErpDeployments[0]);
        }, e => reject(e));
      }, e => reject(e));
    });
  }

  async updateMiniErpDeployment(miniErpDeployment: MiniErpDeploymentModel, params?: { [key: string]: any }) {
    return new Promise<MiniErpDeploymentModel>((resolve, reject) => {
      if (!params) params = {};
      params['id'] = miniErpDeployment.Code;
      params['silent'] = true;
      this.apiService.put<MiniErpDeploymentModel[]>('/mini-erp/deployments', params, [miniErpDeployment], resp => resolve(resp[0]), e => reject(e));
    });
  }

  async deployPbxAndMiniErp(newFormDatas: PbxCustomerModel[], onAfterDeploy: () => void, error: (error: any) => void) {

    /** Prepare info */
    const newFormData = newFormDatas[0];
    const formData: {
      Code: string,
      Pbx: string,
      DomainName: string,
      Name: string,
      Phone: string,
      Email: string,
      PstnNumber: string,
      Extensions: string,
      Hosting: string;
      Gateway: string,
    } = this.form.value['array'][0];

    const hosting: WhHostingModel = this.hostingList.filter(w => w.Code === formData.Hosting)[0];
    const pbx = this.pbxList.filter(p => p.Code === formData.Pbx)[0];
    const deployName = formData.DomainName.split('.')[0];

    let miniErpDeployment = await new Promise<MiniErpDeploymentModel>((resolve, reject) => {
      this.apiService.get<MiniErpDeploymentModel[]>('/mini-erp/deployments', { customer: newFormData['Code'] }, resp => resolve(resp[0]), e => reject(e));
    });

    let tryCount = 0;
    let newPbxDomain: PbxDomainModel;
    let newPbxUser: PbxUserModel;
    let newPbxExtensions: PbxExtensionModel[];
    let newPbxPstnNumber: PbxPstnNumberModel;
    let newPbxOutboundRule: PbxDialplanModel;
    let newWesite: WhWebsiteModel;
    let newWebsiteDbUser: WhDatabaseUserModel;
    let newWesiteDb: WhDatabaseModel;
    let newWebsiteFtp: WhFtpModel;
    // let newMiniErpDeployment: MiniErpDeploymentModel;


    const executeList: Executable[] = [
      // Deply PBX
      {
        message: 'Khởi tạo tổng đài',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          newPbxDomain = await this.deployPbxDomain(pbx.Code, formData.DomainName, formData.Name, true);
          return true;
        },
      },
      {
        message: 'Tạo thông tin kết nối api cho tổng đài',
        maxTry: 5,
        delayTry: 15000,
        execute: async () => {
          newPbxUser = await this.deployPbxPbxUser(pbx.Code, newPbxDomain.DomainId, 'Admin', 'Admin', formData.Name, formData.Email, ['admin'], 'admin');
          miniErpDeployment.PbxApiKey = newPbxUser.api_key;
          miniErpDeployment = await this.updateMiniErpDeployment(miniErpDeployment);
          return true;
        },
      },
      {
        message: 'Tạo danh sách số mở rộng cho tổng đài',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          newPbxExtensions = await this.deployPbxExtensions(pbx.Code, newPbxDomain.DomainId, newPbxDomain.DomainName, formData.Extensions);
          return true;
        },
      },
      {
        message: 'Khai báo số đấu nối cho tổng đài',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          if (formData.PstnNumber) {
            newPbxPstnNumber = await this.deployPbxPstnNumber(pbx.Code, newPbxDomain.DomainId, newPbxDomain.DomainName, formData.PstnNumber, newPbxExtensions[0].extension);
          }
          return true;
        },
      },
      // Deploy minierp
      {
        message: 'Cài đặt quy tắt gọi ra',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          if (formData.Gateway) {
            newPbxOutboundRule = await this.deployPbxOutboundRule(pbx.Code, newPbxDomain.DomainId, newPbxDomain.DomainName, newPbxPstnNumber.destination_accountcode, formData.Gateway);
          }
          return true;
        },
      },
      {
        message: 'Tạo trang quản lý',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          newWesite = await this.deployMiniErpWebiste(hosting.Code, newPbxDomain.DomainName);
          return true;
        },
      },
      {
        message: 'Tạo webiste database user',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          newWebsiteDbUser = await this.deployMiniErpDatabaseUser(hosting.Code, hosting.ClientId, deployName);
          miniErpDeployment.DbHost = 'localhost';
          miniErpDeployment.DbUser = newWebsiteDbUser.database_user;
          miniErpDeployment.DbPassword = newWebsiteDbUser.database_password;
          miniErpDeployment = await this.updateMiniErpDeployment(miniErpDeployment);
          return true;
        },
      },
      {
        message: 'Tạo website database',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          newWesiteDb = await this.deployMiniErpDatabase(hosting.Code, newWesite.domain_id, hosting.ClientId, newWebsiteDbUser.database_user_id, deployName);
          miniErpDeployment.DbName = newWesiteDb.database_name;
          miniErpDeployment = await this.updateMiniErpDeployment(miniErpDeployment);
          return true;
        },
      },
      {
        message: 'Tạo website ftp',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          newWebsiteFtp = await this.deployMiniErpFtp(hosting.Code, hosting.ClientName, newWesite.domain_id, deployName);
          miniErpDeployment.FtpUser = newWebsiteFtp.username;
          miniErpDeployment.FtpPassword = newWebsiteFtp.password;
          miniErpDeployment = await this.updateMiniErpDeployment(miniErpDeployment);
          return true;
        },
      },
      // {
      //   message: 'Triển khai Mini ERP',
      //   maxTry: 3,
      //   delayTry: 15000,
      //   execute: async () => {
      //     newMiniErpDeployment = await this.deployMiniErpCore(formData.Code, true);
      //     return true;
      //   },
      // },
      // Deploy mini erp
      {
        message: 'Kiểm tra kết nối FTP',
        maxTry: 30,
        delayTry: 10000,
        execute: async () => {
          await this.checkFtpReady(miniErpDeployment.Code);
          return true;
        },
      },
      {
        message: 'Tải lên webste bộ cài Mini ERP',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          await this.uploadMiniErpInstaller(miniErpDeployment.Code);
          return true;
        },
      },
      {
        message: 'Kiểm tra website online',
        maxTry: 30,
        delayTry: 10000,
        execute: async () => {
          await this.checkDomainReady(miniErpDeployment.Code);
          return true;
        },
      },
      {
        message: 'Giải nén bộ cài Mini ERP',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          miniErpDeployment = await this.extractMiniErpInstaller(miniErpDeployment.Code);
          return true;
        },
      },
      {
        message: 'Cấu hình Mini ERP',
        maxTry: 10,
        delayTry: 15000,
        execute: async () => {
          miniErpDeployment = await this.configMiniErp(miniErpDeployment.Code);
          return true;
        },
      },
      {
        message: 'Cấu hình người dùng cho Mini ERP',
        maxTry: 10,
        delayTry: 15000,
        execute: async () => {
          miniErpDeployment = await this.configUserForMiniErp(miniErpDeployment.Code);
          return true;
        },
      },
      {
        message: 'Dọn dep file cài đặt Mini ERP',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          miniErpDeployment = await this.cleanMiniErpInstaller(miniErpDeployment.Code);
          return true;
        },
      },
      {
        message: 'Đã triển khai xong Mini ERP cho ' + formData.Name,
        title: formData.DomainName,
        status: 'success',
        maxTry: 3,
        delayTry: 15000,
        execute: async () => {
          this.dialogService.open(ShowcaseDialogComponent, {
            context: {
              title: 'Triển khai Mini ERP',
              content: 'Đã triển khai thành công Mini ERP cho khách ' + formData.Name,
              actions: [
                {
                  label: 'Trở về',
                  icon: 'back',
                  status: 'info',
                  action: () => { },
                },
                {
                  label: 'Truy cập',
                  icon: 'goto',
                  status: 'success',
                  action: () => {
                    window.open(`https://${formData.DomainName}`);
                  },
                },
              ],
            },
          });
          return true;
        },
      },

    ];

    /** Execute deployment */
    let execute: Executable;
    setTimeout(() => this.onProcessing(), 1001);
    const numOfStep = executeList.length;
    let processedStep = 0;
    while (execute = executeList.shift()) {
      processedStep++;
      this.onProcessing();
      this.progressBarValue = processedStep / numOfStep * 100;
      this.processBarlabel = execute.message;
      tryCount = 0;
      while (true) {
        this.onProcessing();
        tryCount++;
        try {
          if (this.longToastRef) this.longToastRef.close();
          this.longToastRef = this.toastrService.show(execute.title ? execute.title : 'Đang thực thi...', execute.message + (tryCount > 1 ? (` lần ${tryCount}/${execute.maxTry}`) : ''), { status: execute.status ? execute.status : 'primary', hasIcon: true, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: execute.durarion ? execute.durarion : 0 });
          // newPbxDomain = await this.deployPbxDomain(pbx.Code, formData.DomainName, formData.Name, tryCount < 5);
          if (execute.execute) {
            await execute.execute();
          }
          break;
        } catch (e) {
          if (tryCount >= execute.maxTry) {
            error(e);
            this.onProcessed();
            this.toastrService.show('STOP: ' + execute.message + (tryCount > 1 ? (` lần ${tryCount}/${execute.maxTry}`) : ''), 'Tiến trình đã dừng do lỗi bị lặp lại quá nhiều lần, Hãy kiểm tra lại thông tin và nhấn nút triển khai lại lần nữa', { status: 'warning', hasIcon: true, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 0 });
            return;
          } else {
            // Notification auto close
            this.toastrService.show('Thông báo lỗi', e && e.error && e.error.logs ? e.error.logs.join('\n') : e, { status: 'warning', hasIcon: true, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 15000 });
          }
        }

        // Close previous notification and open new
        if (this.longToastRef) this.longToastRef.close();
        this.longToastRef = this.toastrService.show('Thử lại trong ' + (execute.delayTry / 1000) + ' giây nữa...', 'Lỗi ' + execute.message, { status: 'danger', hasIcon: true, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 0 });
        await new Promise(resolve => setTimeout(() => resolve(), execute.delayTry));
      }

    }

    this.onProcessed();
    onAfterDeploy();
  }

  deployPbxAndMiniErpX(newFormDatas: PbxCustomerModel[], onAfterDeploy: () => void, error: (error: any) => void) {
    // super.onAfterUpdateSubmit(newFormData);

    const newFormData = newFormDatas[0];
    let longToastRef: NbToastRef = null;

    this.progressBarValue = 40;
    this.processBarlabel = 'Tạo tài khoản';

    this.progressBarValue = 40;
    const domain = new PbxDomainModel();
    const formData: {
      Code: string,
      Pbx: string,
      DomainName: string,
      Name: string,
      Phone: string,
      Email: string,
      PstnNumber: string,
      Extensions: string,
      Hosting: string;
    } = this.form.value['array'][0];
    if (formData) {

      const webHosting: WhHostingModel = this.hostingList.filter(w => w.Code === formData.Hosting)[0];
      const pbx = this.pbxList.filter(p => p.Code === formData.Pbx)[0];

      setTimeout(() => {
        this.onProcessing();
      }, 1000);

      // Create/update user
      // const user = new UserModel();
      // if (newFormData.User) {
      //   user.Code = newFormData.User;
      // }
      // user.Name = formData.Name;
      // user.Username = formData.Phone;
      // user.Phone = formData.Phone;
      // user.Email = formData.Email;
      // user.Password = this.commonService.generatePassword(6);
      // user.Groups = ['IVOIP'];
      ((callback: (newUser: UserModel) => void) => {
        callback(new UserModel());
        // if (user.Code) {
        //   this.apiService.put<UserModel[]>('/user/users', {}, [user], newUsers => {
        //     callback(newUsers[0]);
        //   }, e => this.onProcessed());
        // } else {
        //   this.apiService.post<UserModel[]>('/user/users', {}, [user], newUsers => {
        //     callback(newUsers[0]);
        //   }, e => this.onProcessed());
        // }
      })((newUser: UserModel) => {
        // console.info(newUser);

        // // Notify
        // this.toastrService.show('success', 'Đã tạo thôn tin người dùng ' + newUser.Name, {
        //   status: 'danger',
        //   hasIcon: true,
        //   position: NbGlobalPhysicalPosition.TOP_RIGHT,
        // });

        this.progressBarValue = 50;
        this.processBarlabel = 'Tạo tên miền';



        ((callback: (newPbxDomain: PbxDomainModel, newAdminUser: PbxUserModel) => void) => {

          ((afterCreateDomain: (newDomain: PbxDomainModel) => void) => {

            /** Try create pbx doamin */
            const tryCreatePbxDomain = (tryCount: number) => {
              this.apiService.get<PbxDomainModel[]>('/ivoip/domains', { DomainName: formData.DomainName }, domains => {

                if (domains.length > 0) {
                  afterCreateDomain(domains[0]);
                } else {
                  // Create domain and assign user to owner domain
                  domain.Pbx = formData.Pbx;
                  domain.DomainName = formData.DomainName;
                  domain.Description = formData.Name;

                  if (longToastRef) {
                    longToastRef.close();
                  }
                  longToastRef = this.toastrService.show('Đang thực thi...', 'Khởi tạo tổng đài', {
                    status: 'warning',
                    hasIcon: true,
                    position: NbGlobalPhysicalPosition.TOP_RIGHT,
                    duration: 0,
                  });

                  this.apiService.post<PbxDomainModel[]>('/ivoip/domains', { silent: tryCount <= 5 }, [domain], newDomains => {

                    const newDomain = newDomains[0];
                    if (newDomain) {
                      if (longToastRef) {
                        longToastRef.close();
                      }
                      afterCreateDomain(newDomain);
                    } else {
                      error('Hệ thống không thể khởi tạo tổng đài');
                    }

                  }, e => {
                    if (tryCount <= 5) {

                      /** Sync pbx domains and get current pbx doamins */
                      this.apiService.put<PbxModel[]>('/ivoip/pbxs', { cachePbxDomain: true }, [pbx], pbxs => { }, null, resp => {
                        // On complete api request
                        /** Retry after 15s */
                        this.toastrService.show('Thử lại trong 15s nữa', 'Khởi tạo tổng đài', {
                          status: 'warning',
                          hasIcon: true,
                          position: NbGlobalPhysicalPosition.TOP_RIGHT,
                          duration: 15000,
                        });
                        setTimeout(() => {
                          tryCreatePbxDomain(tryCount + 1);
                        }, 15000);
                      });
                    } else {
                      error(e);
                    }
                  });
                }
              });
            };
            tryCreatePbxDomain(1);
          })((newDomain) => {

            const domainUuid = newDomain.DomainId + '@' + newDomain.Pbx;

            if (longToastRef) {
              longToastRef.close();
            }
            longToastRef = this.toastrService.show('Đang thực thi...', 'Tạo thông tin kết nối cho tổng đài mới', {
              status: 'primary',
              hasIcon: true,
              position: NbGlobalPhysicalPosition.TOP_RIGHT,
              duration: 0,
            });

            /** Create admin user for new domain */
            ((afterCreateDomainAdminUser: (newAdminUser: PbxUserModel) => void) => {
              this.apiService.get<PbxUserModel[]>('/ivoip/users', { username: 'admin', domainId: domainUuid }, oldPbxUsers => {
                let pbxUser: PbxUserModel = null;
                let method = 'POST';
                if (oldPbxUsers.length > 0) {
                  pbxUser = oldPbxUsers[0];
                  method = 'PUT';
                } else {
                  pbxUser = new PbxUserModel();
                }
                this.apiService.get<{ data: string }>('/ivoip/users', { generateApiKey: true, domainId: domainUuid }, apiKey => {
                  pbxUser.username = 'admin';
                  pbxUser.password = 'MiniERP@' + apiKey.data;
                  pbxUser.user_email = formData.Email;
                  pbxUser.contact_name_given = 'Admin';
                  pbxUser.contact_name_family = 'Mini ERP';
                  pbxUser.contact_organization = formData.Name;
                  pbxUser.domain_uuid = newDomain.DomainId;
                  pbxUser.api_key = apiKey.data;
                  pbxUser.groups = ['admin'];
                  pbxUser.user_enabled = true;

                  this.apiService.postPut<PbxUserModel[]>(method, '/ivoip/users', { domainId: domainUuid }, [pbxUser], newPbxUsers => {
                    afterCreateDomainAdminUser(newPbxUsers[0]);
                  }, e => error(e));
                });
              }, e => error(e));
            })((newAdminUser) => {

              if (longToastRef) {
                longToastRef.close();
              }
              longToastRef = this.toastrService.show('Đang thực thi...', 'Khởi tạo số mở rộng (extension) cho tổng đài', {
                status: 'primary',
                hasIcon: true,
                position: NbGlobalPhysicalPosition.TOP_RIGHT,
                duration: 0,
              });

              /** Create extensions */
              this.progressBarValue = 60;
              this.processBarlabel = 'Tạo số mở rộng';

              // Config pstn number
              let exts: string[] = [];
              let minExtension: string;
              let maxExtension: string;
              let firstExtension: string;
              if (/\,/.test(formData.Extensions)) {
                exts = formData.Extensions.split(',');
                firstExtension = exts[0];
              } else {
                const tmpList = formData.Extensions.split('-');
                if (tmpList.length > 1) {
                  minExtension = tmpList[0];
                  maxExtension = tmpList[1];
                  firstExtension = minExtension;

                  for (let i = +minExtension; i <= +maxExtension; i++) {
                    exts.push('' + i);
                  }
                } else if (tmpList[0]) {
                  exts.push('' + tmpList[0]);
                }
              }

              const extensions: PbxExtensionModel[] = [];
              exts.forEach(ext => {
                extensions.push({
                  extension: ext,
                  call_timeout: 30,
                  enabled: true,
                  password: '',
                  domain_uuid: newDomain.DomainId,
                  user_record: 'all',
                  description: ext + '@' + newDomain.DomainName,
                });
              });

              ((afterCreateExtensions: () => void) => {
                this.apiService.get<PbxExtensionModel[]>('/ivoip/extensions', { domainId: domainUuid }, oldExtensions => {
                  if (oldExtensions.length > 0) {
                    afterCreateExtensions();
                  } else {
                    if (extensions.length > 0) {
                      this.apiService.post<PbxExtensionModel[]>('/ivoip/extensions', { domainId: domainUuid }, extensions, newExtensions => {
                        console.info(newExtensions);

                        // Notify
                        this.toastrService.show('success', 'Đã khai báo số mở rộng ' + newExtensions.map(item => item.description).join('; '), {
                          status: 'primary',
                          hasIcon: true,
                          position: NbGlobalPhysicalPosition.TOP_RIGHT,
                        });
                        afterCreateExtensions();
                      }, e => error(e));
                    } else {
                      afterCreateExtensions();
                    }
                  }
                }, e => error(e));
              })(() => {

                if (longToastRef) {
                  longToastRef.close();
                }
                longToastRef = this.toastrService.show('Đang thực thi...', 'Cấu hình số đấu đối cho tổng đài mới', {
                  status: 'primary',
                  hasIcon: true,
                  position: NbGlobalPhysicalPosition.TOP_RIGHT,
                  duration: 0,
                });

                this.progressBarValue = 70;
                this.processBarlabel = 'Cấu hình số đấu nối';

                ((afterCreatePstnNumber: (pstnNumber?: PbxPstnNumberModel) => void) => {

                  if (!formData.PstnNumber) {
                    afterCreatePstnNumber();
                  } else {

                    this.apiService.get<PbxPstnNumberModel[]>('/ivoip/pstn-numbers', { domainId: domainUuid, destination_accountcode: formData.PstnNumber }, oldPstnNumbers => {
                      if (oldPstnNumbers.length > 0) {
                        afterCreatePstnNumber(oldPstnNumbers[0]);
                      } else {
                        const pstnNumber = new PbxPstnNumberModel();
                        pstnNumber.destination_accountcode = formData.PstnNumber;
                        pstnNumber.destination_number = '(\\d{1,3}' + formData.PstnNumber.replace(/^0/, '') + ')';
                        pstnNumber.domain_uuid = newDomain.DomainId;
                        pstnNumber.destination_type = 'inbound';
                        pstnNumber.destination_description = 'Goi vao';
                        pstnNumber.destination_record = true;
                        pstnNumber.destination_enabled = true;
                        pstnNumber.dialplan_details = [
                          {
                            dialplan_detail_data: 'transfer:' + firstExtension + ' XML ' + newDomain.DomainName,
                          },
                        ];

                        this.apiService.post<PbxPstnNumberModel[]>('/ivoip/pstn-numbers', { domainId: domainUuid }, [pstnNumber], newPstnNumbers => {
                          const newPstnNumber = newPstnNumbers[0];
                          console.info(newPstnNumber);

                          // Notify
                          this.toastrService.show('success', 'Đã khai báo số đấu nối ' + newPstnNumber.destination_accountcode, {
                            status: 'info',
                            hasIcon: true,
                            position: NbGlobalPhysicalPosition.TOP_RIGHT,
                          });

                          afterCreatePstnNumber(newPstnNumber);


                        }, e => error(e));
                      }
                    }, e => error(e));
                  }
                })((pstnNumber) => {

                  if (!pstnNumber) {
                    callback(newDomain, newAdminUser);
                  } else {

                    if (longToastRef) {
                      longToastRef.close();
                    }
                    longToastRef = this.toastrService.show('Đang thực thi...', 'Cấu hình quy tắt gọi ra cho tổng đài mới', {
                      status: 'primary',
                      hasIcon: true,
                      position: NbGlobalPhysicalPosition.TOP_RIGHT,
                      duration: 0,
                    });

                    this.progressBarValue = 80;
                    this.processBarlabel = 'Cấu hình quy tắt gọi ra';

                    // Create outbound route
                    const dialplan = new PbxDialplanModel();
                    dialplan.dialplan_type = 'outbound';
                    dialplan.dialplan_gateway = '';
                    dialplan.dialplan_name = 'Goi ra ' + pstnNumber.destination_accountcode;
                    dialplan.dialplan_number = pstnNumber.destination_accountcode;
                    dialplan.dialplan_regex = '\d{7,12}';
                    dialplan.dialplan_context = newDomain.DomainName;
                    dialplan.domain_uuid = newDomain.DomainId;
                    dialplan.dialplan_description = 'Goi ra ' + pstnNumber.destination_accountcode;
                    dialplan.dialplan_order = 100;
                    dialplan.dialplan_enabled = true;

                    this.apiService.post<PbxDialplanModel[]>('/ivoip/dialplans', { domainId: domainUuid }, [dialplan], newDialplans => {

                      console.info(newDialplans);

                      // Notify
                      this.toastrService.show('success', 'Đã thêm cấu hình gọi ra', {
                        status: 'success',
                        hasIcon: true,
                        position: NbGlobalPhysicalPosition.TOP_RIGHT,
                      });

                      callback(newDomain, newAdminUser);

                    }, e => error(e));
                  }
                });
              });
            });
          });
        })((newDomain: PbxDomainModel, newAdminUser: PbxUserModel) => {
          console.info(newDomain);

          // Notify
          this.toastrService.show(newDomain.DomainName, 'Đã tạo tên miền ' + newDomain.DomainName, {
            status: 'success',
            hasIcon: true,
            position: NbGlobalPhysicalPosition.TOP_RIGHT,
          });

          if (longToastRef) {
            longToastRef.close();
          }
          longToastRef = this.toastrService.show('Đang thực thi...', 'Tạo giao diện quản lý cho tổng đài mới', {
            status: 'warning',
            hasIcon: true,
            position: NbGlobalPhysicalPosition.TOP_RIGHT,
            duration: 0,
          });

          this.progressBarValue = 80;
          this.processBarlabel = 'Tạo giao diện quản lý';

          // Create new website
          ((callback: (newWesite: WhWebsiteModel) => void) => {
            this.apiService.get<WhWebsiteModel[]>('/web-hosting/websites', { hosting: webHosting.Code, domain: newDomain.DomainName }, oldWebsites => {

              let website = oldWebsites[0];
              let menthod = 'POST';
              if (website) {
                menthod = 'PUT';
              } else {
                website = new WhWebsiteModel();
              }

              website.hosting = webHosting.Code;
              website.domain = newDomain.DomainName;

              // else {
              this.apiService.postPut<WhWebsiteModel[]>(menthod, '/web-hosting/websites', { hosting: webHosting.Code }, [website], newWebsites => {
                const newWebsite = newWebsites[0];
                if (newWebsite) {

                  // Notify
                  this.toastrService.show('success', 'Đã khao báo website', {
                    status: 'success',
                    hasIcon: true,
                    position: NbGlobalPhysicalPosition.TOP_RIGHT,
                  });
                  callback(newWebsite);
                } else {
                  // this.onProcessed();
                  error('System could not create website');
                }
              }, e => error(e));
              // }
            }, e => error(e));
          })((newWebsite) => {

            // Create db user
            ((callback: (newDbUser: WhDatabaseUserModel) => void) => {


              const dbUsername = 'c' + webHosting.ClientId + newDomain.DomainName.split('.')[0];
              this.apiService.get<WhDatabaseUserModel[]>('/web-hosting/database-users', { hosting: webHosting.Code, database_user: dbUsername }, oldDbUsers => {
                let dbUser = oldDbUsers[0];
                let method = 'POST';
                if (dbUser) {
                  // callback(oldDbUser);
                  method = 'PUT';
                  // dbUser.database_password = 'mtsg513733';
                } else {
                  dbUser = new WhDatabaseUserModel();
                }

                dbUser.database_user = dbUsername;
                dbUser.database_password = 'mtsg513733';

                // else {

                this.apiService.postPut<WhDatabaseUserModel[]>(method, '/web-hosting/database-users', { hosting: webHosting.Code }, [dbUser], newDbUsers => {
                  const newDbUser = newDbUsers[0];
                  if (newDbUser) {
                    // Notify
                    this.toastrService.show('success', 'Đã khao báo website database user', {
                      status: 'success',
                      hasIcon: true,
                      position: NbGlobalPhysicalPosition.TOP_RIGHT,
                    });

                    newDbUser.database_password = 'mtsg513733';
                    callback(newDbUser);
                  } else {
                    // this.onProcessed();
                    error('System could not create websting db user');
                  }
                }, e => error(e));
                // }
              }, e => error(e));
            })((newDbUser) => {
              // Create database
              ((callback: (newDatabase: WhDatabaseModel) => void) => {

                const database = new WhDatabaseModel();
                database.parent_domain_id = newWebsite.domain_id;
                database.database_user_id = newDbUser.database_user_id;
                database.database_name = newDbUser.database_user;

                this.apiService.get<WhDatabaseModel[]>('/web-hosting/databases', { hosting: webHosting.Code, database_name: database.database_name }, oldDatabases => {
                  const oldDatabase = oldDatabases[0];
                  if (oldDatabase) {
                    callback(oldDatabase);
                  } else {


                    this.apiService.post<WhDatabaseModel[]>('/web-hosting/databases', { hosting: webHosting.Code }, [database], newDatabases => {
                      const newDatabase = newDatabases[0];
                      if (newDatabase) {

                        // Notify
                        this.toastrService.show('success', 'Đã khao báo website database', {
                          status: 'success',
                          hasIcon: true,
                          position: NbGlobalPhysicalPosition.TOP_RIGHT,
                        });

                        callback(newDatabase);

                      } else {
                        // this.onProcessed();
                        error('System could not create web hosting database');
                      }
                    }, e => error(e));
                  }
                }, e => error(e));

              })((newDatabase) => {
                // Create ftp account


                ((callback: (newFtp: WhFtpModel) => void) => {


                  const ftpUser = webHosting.ClientName + newDomain.DomainName.split('.')[0];
                  this.apiService.get<WhFtpModel[]>('/web-hosting/ftps', { hosting: webHosting.Code, username: ftpUser }, oldFtps => {

                    let ftp = oldFtps[0];
                    let method = 'POST';
                    if (ftp) {
                      // ftp.password = 'mtsg513733';
                      // callback(oldFtp);
                      method = 'PUT';
                    } else {
                      ftp = new WhFtpModel();
                    }

                    ftp.parent_domain_id = newWebsite.domain_id;
                    ftp.username = ftpUser;
                    ftp.password = 'mtsg513733';

                    // else {
                    this.apiService.postPut<WhFtpModel[]>(method, '/web-hosting/ftps', { hosting: webHosting.Code }, [ftp], newFtps => {

                      const newFtp = newFtps[0];
                      if (newFtp) {
                        newFtp.password = 'mtsg513733';
                        callback(newFtp);
                      } else {
                        // this.onProcessed();
                        error('System could not create web hosting ftp user');
                      }
                    }, e => error(e));
                    // }
                  }, e => error(e));


                })((newFtp) => {
                  // Wait for webiste complete processing

                  // Notify
                  this.toastrService.show('success', 'Đã tạo tài khoản ftp cho website', {
                    status: 'success',
                    hasIcon: true,
                    position: NbGlobalPhysicalPosition.TOP_RIGHT,
                  });

                  // Notify
                  this.toastrService.show('success', 'Chờ wesite được khởi tạo', {
                    status: 'success',
                    hasIcon: true,
                    position: NbGlobalPhysicalPosition.TOP_RIGHT,
                  });

                  // Upload mini erp source code
                  console.info(webHosting);

                  // Check
                  this.apiService.get<MiniErpDeploymentModel[]>('/mini-erp/deployments', { customer: newFormData.Code }, miniErpDeployments => {
                    if (miniErpDeployments.length > 0) {

                      const miniErpDeployment = miniErpDeployments[0];

                      miniErpDeployment.FtpHost = webHosting.Host;
                      miniErpDeployment.Domain = formData.DomainName;
                      miniErpDeployment.FtpUser = newFtp.username;
                      miniErpDeployment.FtpPassword = newFtp.password;
                      miniErpDeployment.DbHost = newFtp.password;
                      miniErpDeployment.DbName = newDatabase.database_name;
                      miniErpDeployment.DbUser = newDbUser.database_user;
                      miniErpDeployment.DbPassword = newDbUser.database_password;
                      miniErpDeployment.PbxApiUrl = pbx.ApiUrl;
                      miniErpDeployment.PbxDomain = formData.DomainName;
                      miniErpDeployment.PbxName = formData.DomainName.toUpperCase();
                      miniErpDeployment.PbxApiKey = newAdminUser.api_key;

                      if (longToastRef) {
                        longToastRef.close();
                      }
                      longToastRef = this.toastrService.show('Đang thực thi...', 'Khởi tạo giao diện quản lý', {
                        status: 'warning',
                        hasIcon: true,
                        position: NbGlobalPhysicalPosition.TOP_RIGHT,
                        duration: 0,
                      });

                      const tryDeployMiniErp = (tryCount: number) => {
                        this.apiService.put<MiniErpDeploymentModel[]>('/mini-erp/deployments', { deploy: true, silent: tryCount <= 5 }, [miniErpDeployment], results => {
                          console.info(results);
                          this.progressBarValue = 100;
                          this.processBarlabel = 'Khởi tạo tổng đài thành công';
                          if (longToastRef) {
                            longToastRef.close();
                          }
                          onAfterDeploy();

                        }, e => {
                          if (tryCount <= 5) {
                            // Notify
                            this.toastrService.show('Thử lại trong 15s nữa', 'Có lỗi xảy ra trong quá trình khởi tạo giao diện quản lý', {
                              status: 'warning',
                              hasIcon: true,
                              position: NbGlobalPhysicalPosition.TOP_RIGHT,
                              duration: 15000,
                            });
                            setTimeout(() => {
                              tryDeployMiniErp(tryCount + 1);
                            }, 15000);
                          } else {
                            error(e);
                          }
                        });
                      };
                      tryDeployMiniErp(1);

                    } else {
                      error('Thông tin triển khai Mini ERP không tồn tại');
                    }
                  }, e => error(e));
                });
              });
            });
          });
        });
      });
    }
  }

  onPbxChange(event: { id: string, text: string }, formGroup: FormGroup, index: number) {
    if (event) {
      this.apiService.get<PbxGatewayModel[]>('/ivoip/gateways', { pbx: event }, gateways => {

        this.gatewaylist = gateways.map(item => {
          return { id: item.gateway_uuid, text: item.gateway };
        });

      });
    } else {
      this.gatewaylist = [];
    }
  }
}
