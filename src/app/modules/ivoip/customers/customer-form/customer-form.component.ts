import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxCustomerModel } from '../../../../models/pbx-customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbGlobalPhysicalPosition } from '@nebular/theme';
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
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Triển khai Tổng Đài Điện Toán',
          content: 'Hoàn tất triển khai Tổng Đài Điện Toán',
          actions: [{ label: 'Ok', icon: 'back', status: 'info', action: () => { } }],
        },
      });
    }, e => {
      this.onProcessed();
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Lỗi triển khai Tổng Đài Điện Toán',
          content: e && e.error && e.error.logs ? e.error.logs.join('<br>') : e,
          actions: [
            { label: 'Đóng', icon: 'back', status: 'info', action: () => { } },
            {
              label: 'Chi tiết', icon: 'ok', status: 'warning', action: () => {
                this.dialogService.open(ShowcaseDialogComponent, {
                  context: {
                    title: 'Lỗi triển khai Tổng Đài Điện Toán',
                    content: e && e.error && e.error.logs ? e.error.logs.join('<br>') : e,
                    actions: [
                      { label: 'Đóng', icon: 'back', status: 'info', action: () => { } },
                    ],
                  },
                });
              },
            },
          ],
        },
      });
    });
  }

  onAfterUpdateSubmit(newFormData: PbxCustomerModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    this.deployPbxAndMiniErp(newFormData, () => {
      this.onProcessed();
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Triển khai Tổng Đài Điện Toán',
          content: 'Hoàn tất triển khai Tổng Đài Điện Toán',
          actions: [{ label: 'Ok', icon: 'back', status: 'info', action: () => { } }],
        },
      });
    }, e => {
      this.onProcessed();
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Lỗi triển khai Tổng Đài Điện Toán',
          content: e && e.error && e.error.logs ? e.error.logs.join('<br>') : e,
          actions: [
            { label: 'Đóng', icon: 'back', status: 'info', action: () => { } },
            {
              label: 'Chi tiết', icon: 'ok', status: 'warning', action: () => {
                this.dialogService.open(ShowcaseDialogComponent, {
                  context: {
                    title: 'Lỗi triển khai Tổng Đài Điện Toán',
                    content: e && e.error && e.error.logs ? e.error.logs.join('<br>') : e,
                    actions: [
                      { label: 'Đóng', icon: 'back', status: 'info', action: () => { } },
                    ],
                  },
                });
              },
            },
          ],
        },
      });
    });
  }

  deployPbxAndMiniErp(newFormDatas: PbxCustomerModel[], onAfterDeploy: () => void, error: (error: any) => void) {
    // super.onAfterUpdateSubmit(newFormData);

    const newFormData = newFormDatas[0];

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
            this.apiService.get<PbxDomainModel[]>('/ivoip/domains', { DomainName: formData.DomainName }, domains => {

              if (domains.length > 0) {
                afterCreateDomain(domains[0]);
              } else {
                // Create domain and assign user to owner domain
                domain.Pbx = formData.Pbx;
                domain.DomainName = formData.DomainName;
                domain.Description = formData.Name;
                // domain.Owner = newUser.Code;
                let tryCount = 0;
                const tryCreatePbxDomain = () => {
                  tryCount++;
                  this.apiService.post<PbxDomainModel[]>('/ivoip/domains', {}, [domain], newDomains => {

                    const newDomain = newDomains[0];
                    if (newDomain) {
                      afterCreateDomain(newDomain);
                    } else {
                      error('System could not create pbx domain');
                    }
                  }, e => {
                    if (tryCount < 10) {

                      this.apiService.put<PbxModel[]>('/ivoip/pbxs', { cachePbxDomain: true }, [pbx], pbxs => {
                        const domainList = pbxs[0].Domains;
                        if (domainList) {
                          const failDomain = domainList.filter(d => d.DomainName === formData.DomainName)[0];
                          if (failDomain) {
                            this.apiService.delete('/ivoip/domains', [failDomain.Id], result => {
                              tryCreatePbxDomain();
                            }, e2 => {
                              console.info(e2);
                              if (error) error(e2);
                            });
                          }
                        }
                      });
                    } else {
                      // console.info(e);
                      error(e);
                    }
                  });
                };
                tryCreatePbxDomain();

              }
            });
          })((newDomain) => {

            const domainUuid = newDomain.DomainId + '@' + newDomain.Pbx;

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
          this.toastrService.show('success', 'Đã tạo tên miền ' + newDomain.DomainName, {
            status: 'warning',
            hasIcon: true,
            position: NbGlobalPhysicalPosition.TOP_RIGHT,
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

                      this.apiService.put<MiniErpDeploymentModel[]>('/mini-erp/deployments', { deploy: true }, [miniErpDeployment], results => {
                        console.info(results);
                        this.progressBarValue = 100;
                        this.processBarlabel = 'Khởi tạo tổng đài thành công';
                        onAfterDeploy();

                      }, e => error(e));

                    } else {
                      error('Mini Erp Deploloyment was not exists');
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
