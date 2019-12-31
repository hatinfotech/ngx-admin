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
import { max } from 'rxjs/operators';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { PbxDialplanModel } from '../../../../models/pbx-dialplan.model';
import { WhWebsiteModel } from '../../../../models/wh-website.model';
import { WhDatabaseUserModel } from '../../../../models/wh-database-user.model';
import { WhDatabaseModel } from '../../../../models/wh-database.model';
import { WhFtpModel } from '../../../../models/wh-ftp.model';

@Component({
  selector: 'ngx-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
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

  // blockActions: { id: string, text: string, Code: string, Name: string }[];
  // select2OptionForBlockActions = {
  //   placeholder: 'Chọn kiểu chặn...',
  //   allowClear: false,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   keyMap: {
  //     id: 'Code',
  //     text: 'Name',
  //   },
  // };

  progressBarValue = 10;
  processBarlabel = 'Tiến trình';

  pbxList: { Code: string, Name: string }[] = [];
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

  ngOnInit() {
    this.restrict();

    this.apiService.get<PbxGatewayModel[]>('/ivoip/gateways', { domainId: this.ivoipService.getPbxActiveDomainUuid() }, gateways => {

      this.gatewaylist = gateways.map(item => {
        return { id: item.gateway_uuid, text: item.gateway };
      });

      this.apiService.get<PbxModel[]>('/ivoip/pbxs', { select: 'Code,Description', limit: 9999 }, list => {
        this.pbxList = this.convertOptionList(list, 'Code', 'Description');
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
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxCustomerModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Phone: ['', Validators.required],
      Email: ['', Validators.email],
      Address: [''],
      Note: [''],
      // Pbx info
      Pbx: ['', Validators.required],
      DomainName: ['', Validators.required],
      PstnNumber: [''],
      Gateway: [''],
      Extensions: ['', Validators.required],
      PrivatePbxNumber: [''],
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
    super.onAfterCreateSubmit(newFormData);
    this.progressBarValue = 40;
    this.processBarlabel = 'Tạo tài khoản';
  }

  onAfterUpdateSubmit(newFormData: PbxCustomerModel[]) {
    // super.onAfterUpdateSubmit(newFormData);
    this.progressBarValue = 40;
    const domain = new PbxDomainModel();
    const formData: {
      Pbx: string,
      DomainName: string,
      Name: string,
      Phone: string,
      Email: string,
      PstnNumber: string,
      Extensions: string,
    } = this.form.value['array'][0];
    if (formData) {

      setTimeout(() => {
        this.onProcessing();
      }, 1000);

      // Create/update user
      const user = new UserModel();
      if (newFormData[0].User) {
        user.Code = newFormData[0].User;
      }
      user.Name = formData.Name;
      user.Username = formData.Phone;
      user.Phone = formData.Phone;
      user.Email = formData.Email;
      user.Password = this.commonService.generatePassword(6);
      user.Groups = ['IVOIP'];
      ((callback: (newUser: UserModel) => void) => {
        if (user.Code) {
          this.apiService.put<UserModel[]>('/user/users', {}, [user], newUsers => {
            callback(newUsers[0]);
          }, e => this.onProcessed());
        } else {
          this.apiService.post<UserModel[]>('/user/users', {}, [user], newUsers => {
            callback(newUsers[0]);
          }, e => this.onProcessed());
        }
      })((newUser: UserModel) => {
        console.info(newUser);

        // Notify
        this.toastrService.show('success', 'Đã tạo thôn tin người dùng ' + newUser.Name, {
          status: 'danger',
          hasIcon: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
        });

        this.progressBarValue = 50;
        this.processBarlabel = 'Tạo tên miền';



        ((callback) => {
          this.apiService.get<PbxDomainModel[]>('/ivoip/domains', { DomainName: formData.DomainName }, domains => {
            if (domains.length > 0) {
              callback(domains[0]);
            } else {

              // Create domain and assign user to owner domain
              domain.Pbx = formData.Pbx;
              domain.DomainName = formData.DomainName;
              domain.Description = formData.Name;
              domain.Owner = newUser.Code;

              this.apiService.post<PbxDomainModel[]>('/ivoip/domains', {}, [domain], newDomains => {

                const newDomain = newDomains[0];

                if (newDomain) {
                  this.progressBarValue = 60;
                  this.processBarlabel = 'Tạo số mở rộng';

                  //
                  const domainUuid = newDomain.DomainId + '@' + newDomain.Pbx;

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

                  this.apiService.post<PbxExtensionModel[]>('/ivoip/extensions', { domainId: domainUuid }, extensions, newExtensions => {
                    console.info(newExtensions);

                    // Notify
                    this.toastrService.show('success', 'Đã khai báo số mở rộng ' + newExtensions.map(item => item.description).join('; '), {
                      status: 'primary',
                      hasIcon: true,
                      position: NbGlobalPhysicalPosition.TOP_RIGHT,
                    });

                    this.progressBarValue = 70;
                    this.processBarlabel = 'Cấu hình số đấu nối';

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

                        callback(newDomain);

                      }, e => this.onProcessed());
                    }, e => this.onProcessed());
                  }, e => this.onProcessed());
                }
              }, e => this.onProcessed());
            }
          });
        })((newDomain: PbxDomainModel) => {
          console.info(newDomain);
          // const newDomain = newDomains[0];

          // Notify
          this.toastrService.show('success', 'Đã tạo tên miền ' + newDomain.DomainName, {
            status: 'warning',
            hasIcon: true,
            position: NbGlobalPhysicalPosition.TOP_RIGHT,
          });


          this.progressBarValue = 80;
          this.processBarlabel = 'Tạo giao diện quản lý';

          // Create new website
          const website = new WhWebsiteModel();
          website.hosting = 'ISPCONFIG33';
          website.domain = newDomain.DomainName;

          this.apiService.post<WhWebsiteModel[]>('/web-hosting/websites', { hosting: 'ISPCONFIG33' }, [website], newWebsites => {
            const newWebsite = newWebsites[0];
            if (newWebsite) {

              // Notify
              this.toastrService.show('success', 'Đã khao báo website', {
                status: 'success',
                hasIcon: true,
                position: NbGlobalPhysicalPosition.TOP_RIGHT,
              });

              // Create database user
              const dbUser = new WhDatabaseUserModel();
              dbUser.database_user = newDomain.DomainName.replace(/[^a-z0-9]/g, '');
              dbUser.database_password = 'mtsg513733';

              this.apiService.post<WhDatabaseUserModel[]>('/web-hosting/database-users', { hosting: 'ISPCONFIG33' }, [dbUser], newDbUsers => {
                const newDbUser = newDbUsers[0];
                if (newDbUser) {

                  // Notify
                  this.toastrService.show('success', 'Đã khao báo website database user', {
                    status: 'success',
                    hasIcon: true,
                    position: NbGlobalPhysicalPosition.TOP_RIGHT,
                  });

                  // Create database
                  const database = new WhDatabaseModel();
                  database.parent_domain_id = newWebsite.domain_id;
                  database.database_user_id = newDbUser.database_user_id;
                  database.database_name = dbUser.database_user;

                  this.apiService.post<WhDatabaseModel[]>('/web-hosting/databases', { hosting: 'ISPCONFIG33' }, [database], newDatabases => {
                    const newDatabase = newDatabases[0];
                    if (newDatabase) {

                      // Notify
                      this.toastrService.show('success', 'Đã khao báo website database', {
                        status: 'success',
                        hasIcon: true,
                        position: NbGlobalPhysicalPosition.TOP_RIGHT,
                      });

                      // Create ftp account
                      const ftp = new WhFtpModel();
                      ftp.parent_domain_id = newWebsite.domain_id;
                      ftp.username = dbUser.database_user;
                      ftp.password = 'mtsg513733';

                      this.apiService.post<WhFtpModel[]>('/web-hosting/ftps', { hosting: 'ISPCONFIG33' }, [ftp], newFtps => {

                        const newFtp = newFtps[0];
                        if (newFtp) {
                          // Wait for webiste complete processing
                          setTimeout(() => {

                            // Notify
                            this.toastrService.show('success', 'Đã tạo tài khoản ftp cho website', {
                              status: 'success',
                              hasIcon: true,
                              position: NbGlobalPhysicalPosition.TOP_RIGHT,
                            });

                            // Upload mini erp source code

                            // Upload php install script

                            // ajax request php install script


                            this.progressBarValue = 100;
                            this.processBarlabel = 'Khởi tạo tổng đài thành công';
                            super.onAfterUpdateSubmit(newFormData);
                            this.onProcessed();
                          }, 2000);
                        }
                      }, e => this.onProcessed());
                    }
                  }, e => this.onProcessed());
                }
              }, e => this.onProcessed());
            }
          }, e => this.onProcessed());


        });


      });
    }
  }
}
