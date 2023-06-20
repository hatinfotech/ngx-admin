import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { environment } from '../../../../../environments/environment.prod';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { BusinessModel } from '../../../../models/accounting.model';
import { ChatRoomMemberModel, ChatRoomModel } from '../../../../models/chat-room.model';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { PromotionActionModel } from '../../../../models/promotion.model';
import { SalesPriceReportModel, SalesPriceReportDetailModel } from '../../../../models/sales.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { CollaboratorService } from '../../collaborator.service';
import { CollaboratorOrderPrintComponent } from '../collaborator-order-print/collaborator-order-print.component';

@Component({
  selector: 'ngx-collaborator-order-form',
  templateUrl: './collaborator-order-form.component.html',
  styleUrls: ['./collaborator-order-form.component.scss']
})
export class CollaboratorOrderFormComponent extends DataManagerFormComponent<SalesPriceReportModel> implements OnInit {

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<CollaboratorOrderFormComponent>,
    public collaboratorService: CollaboratorService,
    public adminProductService: AdminProductService,
    public mobileAppService: MobileAppService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

    /** Append print button to head card */
    this.actionButtonList.splice(this.actionButtonList.length - 1, 0, {
      name: 'print',
      status: 'primary',
      label: this.cms.textTransform(this.cms.translate.instant('Common.print'), 'head-title'),
      icon: 'printer',
      title: this.cms.textTransform(this.cms.translate.instant('Common.print'), 'head-title'),
      size: 'medium',
      disabled: () => this.isProcessing,
      hidden: () => false,
      click: (event: any, option: ActionControlListOption) => {
        this.preview(option.form);
      },
    });
  }

  componentName: string = 'CollaboratorOrderFormComponent';
  idKey = 'Code';
  apiPath = '/collaborator/orders';
  baseFormUrl = '/collaborator/order/form';
  listUrl = '/collaborator/page/order/list';

  env = environment;

  locale = this.cms.getCurrentLoaleDataset();
  priceCurencyFormat: CurrencyMaskConfig = { ...this.cms.getCurrencyMaskConfig(), precision: 0 };
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.cms.getCurrencyMaskConfig(), precision: 0 };
  quantityFormat: CurrencyMaskConfig = { ...this.cms.getNumberMaskConfig(), precision: 2 };
  towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: (UnitModel & { id?: string, text?: string })[];

  customIcons: { [key: string]: CustomIcon[] } = {};
  getCustomIcons(name: string): CustomIcon[] {
    if (this.customIcons[name]) return this.customIcons[name];
    return this.customIcons[name] = [{
      icon: 'plus-square-outline',
      title: this.cms.translateText('Common.addNewProduct'),
      status: 'success',
      states: {
        '<>': {
          icon: 'edit-outline',
          status: 'primary',
          title: this.cms.translateText('Common.editProduct'),
        },
        '': {
          icon: 'plus-square-outline',
          status: 'success',
          title: this.cms.translateText('Common.addNewProduct'),
        },
      },
      action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
        const currentProduct = this.cms.getObjectId(formGroup.get('Product').value);
        this.cms.openDialog(ProductFormComponent, {
          context: {
            inputMode: 'dialog',
            inputId: currentProduct ? [currentProduct] : null,
            showLoadinng: true,
            onDialogSave: (newData: ProductModel[]) => {
              console.log(newData);
              // const formItem = formGroupComponent.formGroup;
              const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.cms.getObjectId(unit?.Unit), text: this.cms.getObjectText(unit?.Unit) })) };
              formGroup.get('Product').patchValue(newProduct);
            },
            onDialogClose: () => {

            },
          },
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }];
  }

  accountingBusinessList: BusinessModel[] = [];
  select2OptionForAccountingBusiness = {
    placeholder: 'Nghiệp vụ kế toán...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    dropdownCssClass: 'is_tags',
    multiple: true,
    // maximumSelectionLength: 1,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  objectControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.cms.translateText('Common.addNewContact'), status: 'success', action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.cms.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          data: [{ Groups: [{ id: 'CUSTOMER', text: this.cms.translateText('Common.customer') }, { id: 'COMPANY', 'text': this.cms.translateText('Common.company') }] }],
          onDialogSave: (newData: ContactModel[]) => {
            console.log(newData);
            // const formItem = formGroupComponent.formGroup;
            const newContact: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Object').patchValue(newContact);
            // this.onSelectProduct(formGroup, newContacgt, option.parentForm)
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];

  contactControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.cms.translateText('Common.addNewContact'), status: 'success', action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.cms.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          data: [{ Groups: [{ id: 'CUSTOMER', text: this.cms.translateText('Common.customer') }, { id: 'PERSONAL', 'text': this.cms.translateText('Common.personal') }] }],
          onDialogSave: (newData: ContactModel[]) => {
            console.log(newData);
            // const formItem = formGroupComponent.formGroup;
            const newContact: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Object').patchValue(newContact);
            // this.onSelectProduct(formGroup, newContacgt, option.parentForm)
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];



  select2OptionForPublisher = {
    ...this.cms.makeSelect2AjaxOption('/contact/contacts', {
      includeIdText: true,
      includeGroups: true,
      sort_SearchRank: 'desc',
      eq_Groups: '[PUBLISHER]',
    }, {
      placeholder: 'Chọn CTV Bán Hàng...', limit: 10, prepareReaultItem: (item) => {
        item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
        return item;
      }
    }),
    // minimumInputLength: 1,
  };

  // select2ContactOption = {
  //   placeholder: 'Chọn liên hệ...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   // multiple: true,
  //   // tags: true,
  //   keyMap: {
  //     id: 'id',
  //     text: 'text',
  //   },
  //   ajax: {
  //     transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
  //       console.log(settings);
  //       const params = settings.data;
  //       this.apiService.getPromise('/contact/contacts', { includeIdText: true, includeGroups: true, filter_Name: params['term'] }).then(rs => {
  //         success(rs);
  //       }).catch(err => {
  //         console.error(err);
  //         failure();
  //       });
  //     },
  //     delay: 300,
  //     processResults: (data: any, params: any) => {
  //       console.info(data, params);
  //       return {
  //         results: data.map(item => {
  //           item['id'] = item['Code'];
  //           item['text'] = item['Code'] + ' - ' + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
  //           return item;
  //         }),
  //       };
  //     },
  //   },
  // };

  select2SalesPriceReportOption = {
    placeholder: 'Chọn bảng giá...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Title',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/sales/master-price-tables', { filter_Title: params['term'] ? params['term'] : '', limit: 20 });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/sales/master-price-tables', { filter_Title: params['term'] ? params['term'] : '', limit: 20 }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Title'];
            return item;
          }),
        };
      },
    },
  };

  uploadConfig = {

  };

  getRequestId(callback: (id?: string[]) => void) {
    // callback(this.inputId);
    return super.getRequestId(callback);
  }

  select2OptionForProduct = {
    placeholder: 'Chọn Hàng hoá/dịch vụ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: false,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/collaborator/product-subscriptions', { select: "id=>Code,text=>Name,Code=>Code,Name=>Name", limit: 40, includeUnit: false, includeUnits: true, unitPrice: true, 'search': params['term'], page: this.collaboratorService.currentpage$?.value });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/collaborator/products', {
          includeIdText: true,
          limit: 40,
          includeUnit: false,
          includeSubscribed: true,
          includePrice: true,
          'search': params['term'],
          page: this.collaboratorService.currentpage$?.value,
          sort_SearchRank: 'desc',
        }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(product => {
            product['text'] = `${product['text']} - ${product['id']}`;
            return product;
          })
        };
      },
    },
  };

  select2OptionForUnit = {
    placeholder: 'Chọn ĐVT...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };
  select2OptionForPage = {
    placeholder: 'Chọn trang...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  select2OptionForProvince = {
    placeholder: 'Chọn tỉnh/TP...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      // url: (params, options: any) => {
      //   return this.apiService.buildApiUrl('/general/locations', { token: this.apiService?.token?.access_token, select: 'id=>Code,text=>CONCAT(TypeLabel;\' \';FullName)', limit: 100, 'search': params['term'], eq_Type: '[PROVINCE,CITY]' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/general/locations', { token: this.apiService?.token?.access_token, select: 'id=>Code,text=>CONCAT(TypeLabel;\' \';FullName)', limit: 100, 'search': params['term'], eq_Type: '[PROVINCE,CITY]' }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data
        };
      },
    },
  };

  makeSelect2Option(select2Options: any, formGroup: FormGroup) {
    return {
      ...select2Options,
      formGroup
    }
  }
  select2OptionForDistrict = {
    placeholder: 'Chọn quận/huyện...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      url: (params, options: any) => {
        const formGroup = options?.formGroup;
        const provice = formGroup && this.cms.getObjectId(formGroup.get('Province').value);
        return this.apiService.buildApiUrl('/general/locations', { token: this.apiService?.token?.access_token, select: 'id=>Code,text=>CONCAT(TypeLabel;\' \';FullName)', limit: 100, 'search': params['term'], eq_Type: '[CDISTRICT,PDISTRICT,BURG,CITYDISTRICT]', eq_Parent: provice });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data
        };
      },
    },
  };

  select2OptionForWard = {
    placeholder: 'Chọn phường/xã/thị trấn...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      url: (params: any, options: any) => {
        const formGroup = options?.formGroup;
        const district = formGroup && this.cms.getObjectId(formGroup.get('District').value);
        return this.apiService.buildApiUrl('/general/locations', { token: this.apiService?.token?.access_token, select: 'id=>Code,text=>CONCAT(TypeLabel;\' \';FullName)', limit: 100, 'search': params['term'], eq_Type: '[VILLAGE,WARD,TOWNS]', eq_Parent: district });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data
        };
      },
    },
  };

  select2OptionForTax = {
    placeholder: 'Chọn thuế...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  // Type field option
  select2OptionForType = {
    placeholder: 'Chọn loại...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };
  select2DataForType = [
    { id: 'PRODUCT', text: 'Sản phẩm' },
    { id: 'SERVICE', text: 'Dịch vụ' },
    { id: 'CATEGORY', text: 'Danh mục' },
  ];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {
    this.accountingBusinessList = await this.apiService.getPromise<BusinessModel[]>('/accounting/business', { eq_Type: '[SALES,WAREHOUSEDELIVERY]', select: 'id=>Code,text=>Name,type=>Type' });
    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('RelativeVouchers').setValue('');
          formItem.get('Title').setValue('Copy of: ' + formItem.get('Title').value);
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            conditonFormGroup.get('Id').setValue('');
          });
        });
      }

      this.actionButtonList.unshift({
        type: 'button',
        name: 'click2call',
        status: 'danger',
        label: 'Gọi cho khách',
        icon: 'phone-call-outline',
        title: 'Gọi cho khách',
        size: 'medium',
        click: () => {
          this.cms.showDialog('Click2Call', 'Bạn có muốn gọi cho khách hàng không ? hệ thống sẽ gọi xuống cho số nội bộ của bạn trước, hãy đảm bảo số nội bộ của bạn đang online !', [
            {
              status: 'basic',
              label: 'Trở về',
            },
            {
              status: 'danger',
              icon: 'phone-call-outline',
              label: 'Gọi ngay',
              action: () => {
                this.apiService.putPromise(this.apiPath + '/' + this.id[0], { click2call: true }, [{ Code: this.id[0] }]).then(rs => {
                  console.log(rs);
                });
              },
            }
          ]);
          return false;
        },
      });

      this.actionButtonList.unshift({
        type: 'button',
        name: 'opentask',
        status: 'primary',
        label: 'Chat với CTV Bán hàng',
        icon: 'message-circle',
        title: 'Chat với CTV Bán hàng',
        size: 'medium',
        click: () => {
          this.cms.showDialog('Chat với CTV Bán hàng', 'Bạn có muốn chát với CTV Bán hàng không ? hệ thống sẽ tạo task và add CTV Bán hàng liên quan vào !', [
            {
              status: 'basic',
              label: 'Trở về',
            },
            {
              status: 'primary',
              icon: 'message-circle',
              label: 'Chat',
              action: async () => {
                const voucher = this.array.controls[0].value;
                let task = voucher.RelativeVouchers?.find(f => f.type == 'CHATROOM');
                if (task) {
                  this.cms.openMobileSidebar();
                  this.mobileAppService.openChatRoom({ ChatRoom: task.id });
                } else {
                  // Assign resource to chat room
                  task = await this.apiService.putPromise<ChatRoomModel[]>('/chat/rooms', { assignResource: true }, [{
                    Code: null,
                    Resources: [
                      {
                        ResourceType: 'CLBRTORDER',
                        Resource: voucher.Code,
                        Title: voucher.Title,
                        Date: voucher.DateOfOrder,
                      }
                    ]
                  }]).then(rs => {
                    if (rs && rs.length > 0) {
                      // const link = rs[0].Resources[0];
                      // if (link && link.ChatRoom) {

                      // Add publisher to chat room
                      this.apiService.putPromise<ChatRoomMemberModel[]>('/chat/room-members', { chatRoom: rs[0].Code }, [{
                        ChatRoom: rs[0].Code as any,
                        Type: 'CONTACT',
                        RefUserUuid: this.cms.getObjectId(voucher.Publisher),
                        Name: voucher.PublisherName,
                        Page: voucher.Page,
                        RefPlatform: 'PROBOXONE',
                        RefType: 'PUBLISHER',
                        id: this.cms.getObjectId(voucher.Publisher),
                      }]).then(rs2 => {

                        // Connect publisher
                        this.apiService.putPromise<ChatRoomMemberModel[]>('/chat/room-members', { chatRoom: rs[0].Code, connectRefContactMember: true }, [{
                          Type: 'CONTACT',
                          Contact: rs2[0].Contact,
                        }]).then(rs3 => {
                          this.cms.openMobileSidebar();
                          this.mobileAppService.openChatRoom({ ChatRoom: rs[0].Code });
                        });

                      });

                      // }
                      return { id: rs[0].Code, text: voucher.Title, type: 'TASK' };
                    }
                  });
                }
              },
            }
          ]);
          return false;
        },
      });

      // Add page choosed
      // this.collaboratorService.pageList$.pipe(take(1), filter(f => f && f.length > 0)).toPromise().then(pageList => {
      //   this.actionButtonList.unshift({
      //     type: 'select2',
      //     name: 'pbxdomain',
      //     status: 'success',
      //     label: 'Select page',
      //     icon: 'plus',
      //     title: this.cms.textTransform(this.cms.translate.instant('Common.createNew'), 'head-title'),
      //     size: 'medium',
      //     select2: {
      //       data: pageList, option: {
      //         placeholder: 'Chọn trang...',
      //         allowClear: false,
      //         width: '100%',
      //         dropdownAutoWidth: true,
      //         minimumInputLength: 0,
      //         keyMap: {
      //           id: 'id',
      //           text: 'text',
      //         },
      //       }
      //     },
      //     value: () => this.collaboratorService.currentpage$.value,
      //     change: (value: any, option: any) => {
      //       this.onChangePage(value);
      //     },
      //     disabled: () => {
      //       return false;
      //     },
      //     click: () => {
      //       // this.gotoForm();
      //       return false;
      //     },
      //   });
      // });

      return status;
    });
  }

  /** Override load cache menthod */
  async loadCache(): Promise<any> {
    const rs = await super.loadCache();
    /** Load and cache tax list */
    this.taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!SalesPriceReportFormComponent._taxList) {
    // } else {
    //   this.taxList = SalesPriceReportFormComponent._taxList;
    // }

    /** Load and cache unit list */
    this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { limit: 'nolimit' })).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!SalesPriceReportFormComponent._unitList) {
    // } else {
    //   this.taxList = SalesPriceReportFormComponent._taxList;
    // }
    return rs;
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: SalesPriceReportModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['includeProductUnitList'] = true;
    params['includeProductPrice'] = true;
    params['useBaseTimezone'] = true;
    params['includeRelativeVouchers'] = true;
    // params['page'] = this.collaboratorService?.currentpage$?.value;
    super.executeGet(params, success, error);
  }

  /** Execute api put */
  executePut(params: any, data: ProductModel[], success: (data: ProductModel[]) => void, error: (e: any) => void) {
    // params['page'] = this.collaboratorService?.currentpage$?.value;
    return super.executePut(params, data, success, error);
  }

  /** Execute api post */
  executePost(params: any, data: ProductModel[], success: (data: ProductModel[]) => void, error: (e: any) => void) {
    // params['page'] = this.collaboratorService?.currentpage$?.value;
    return super.executePost(params, data, success, error);
  }

  async formLoad(formData: SalesPriceReportModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: SalesPriceReportModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);
        details.clear();
        itemFormData.Details.forEach(detailData => {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detailData);
          detailData.AccessNumbers = Array.isArray(detailData.AccessNumbers) && detailData.AccessNumbers.length > 0 ? (detailData.AccessNumbers.map(ac => this.cms.getObjectId(ac)).join('\n') + '\n') : '';
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: SalesPriceReportModel): FormGroup {
    const newForm = this.formBuilder.group({
      Page: [this.collaboratorService.currentpage$.value, Validators.required],
      Code: { disabled: false, value: null },
      Object: [''],
      ObjectName: ['', Validators.required],
      ObjectEmail: [''],
      ObjectPhone: [''],
      ObjectAddress: [''],
      ObjectBankName: [''],
      ObjectBankAccount: [''],
      // ObjectIdentifiedNumber: [''],
      // Contact: [''],
      // ContactName: [''],
      // ContactPhone: [''],
      // ContactEmail: [''],
      // ContactAddress: [''],
      // ContactIdentifiedNumber: [''],
      // ObjectTaxCode: [''],
      // DirectReceiverName: [''],
      // PaymentStep: [''],
      // PriceTable: [''],
      // Shipper: [''],
      // ShipperName: [''],
      // ShipperPhone: [''],
      // ShipperEmail: [''],
      // ShipperAddress: [''],
      Publisher: [''],
      PublisherName: [''],
      PublisherPhone: [''],
      PublisherEmail: [''],
      PublisherAddress: [''],
      Province: [],
      District: [],
      Ward: [],
      DeliveryAddress: [],
      DeliveryCost: [],
      OriginDeliveryCost: [],
      DateOfOrder: [new Date(), Validators.required],
      // DateOfDelivery: [''],
      Title: ['', Validators.required],
      Note: [''],
      SubNote: [''],
      Reported: [''],
      RequireInvoice: [false],
      _total: [''],
      RelativeVouchers: [''],
      State: [],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      // newForm.patchValue(data);
      this.patchFormGroupValue(newForm, data);
      // this.toMoney(newForm);
    } else {
      this.addDetailFormGroup(newForm);
    }
    return newForm;
  }

  patchFormGroupValue = (formGroup: FormGroup, data: SalesPriceReportModel) => {

    // for (const propName in data) {
    //   const prop = data[propName];
    //   if (prop && prop.restricted) {
    //     formGroup.get(propName)['placeholder'] = data[propName]['placeholder']
    //     delete (data[propName]);
    //   }
    //   // if (data['ObjectPhone'] && data['ObjectPhone']['restricted']) formGroup.get('ObjectPhone')['placeholder'] = data['ObjectPhone']['placeholder']; else formGroup.get('ObjectPhone').patchValue(data['ObjectPhone']);
    // }

    this.prepareRestrictedData(formGroup, data);
    // if (data['ObjectAddress'] && data['ObjectAddress']['restricted']) formGroup.get('ObjectAddress')['placeholder'] = data['ObjectAddress']['placeholder']; else formGroup.get('ObjectAddress').patchValue(data['ObjectAddress']);
    // if (data['ObjectEmail'] && data['ObjectEmail']['restricted']) formGroup.get('ObjectEmail')['placeholder'] = data['ObjectEmail']['placeholder']; else formGroup.get('ObjectEmail').patchValue(data['ObjectEmail']);
    // if (data['ObjectIdentifiedNumber'] && data['ObjectIdentifiedNumber']['restricted']) formGroup.get('ObjectIdentifiedNumber')['placeholder'] = data['ObjectIdentifiedNumber']['placeholder']; else formGroup.get('ObjectIdentifiedNumber').patchValue(data['ObjectAddress']);
    // // formGroup.get('ObjectAddress')['placeholder'] = data['ObjectAddress'];
    // // data['ObjectPhone'] = null;
    // // data['ObjectAddress'] = null;

    // if (data['ObjectPhone'] && data['ObjectPhone']['restricted']) formGroup.get('ObjectPhone')['placeholder'] = data['ObjectPhone']['placeholder']; else formGroup.get('ObjectPhone').patchValue(data['ObjectPhone']);
    // formGroup.get('ContactPhone')['placeholder'] = data['ContactPhone'];
    // formGroup.get('ContactAddress')['placeholder'] = data['ContactAddress'];
    // data['ContactPhone'] = null;
    // data['ContactAddress'] = null;

    // if (data.Infos?.Description && Array.isArray(data.Infos?.Description)) {
    //   (data.Infos?.Description as any).pop();
    // }
    formGroup.patchValue(data);
    return true;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: SalesPriceReportModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    // super.goback();
    if (this.mode === 'page') {
      this.router.navigate([this.listUrl]);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Detail Form */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: SalesPriceReportDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      // Id: [''],
      No: [''],
      Type: ['PRODUCT'],
      Product: [''],
      Description: [''],
      Quantity: [1],
      Price: [0],
      Unit: [''],
      // Tax: ['VAT10'],
      ToMoney: [0],
      Image: [[]],
      // Reason: [''],
      // AccessNumbers: [],
      // Business: [this.accountingBusinessList.filter(f => f.id === 'NETREVENUE')],
    });

    if (data) {
      newForm.patchValue(data);
      this.toMoney(parentFormGroup, newForm);
      if (data.Product && data.Product.Units && data.Product.Units.length > 0) {
        newForm['unitList'] = data.Product.Units;
      } else {
        newForm['unitList'] = this.adminProductService.unitList$.value;
      }
    } else {
      newForm['unitList'] = this.adminProductService.unitList$.value;
    }
    return newForm;
  }
  getDetails(parentFormGroup: FormGroup) {
    return parentFormGroup.get('Details') as FormArray;
  }
  addDetailFormGroup(parentFormGroup: FormGroup) {
    const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    this.getDetails(parentFormGroup).push(newChildFormGroup);
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    this.calulateTotal(parentFormGroup);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup) {
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
  }
  /** End Detail Form */

  /** Action Form */
  makeNewActionFormGroup(data?: PromotionActionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Type: ['', Validators.required],
      Product: [''],
      Amount: [''],
      // Discount: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  getActions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Actions') as FormArray;
  }
  addActionFormGroup(formGroupIndex: number) {
    const newFormGroup = this.makeNewActionFormGroup();
    this.getActions(formGroupIndex).push(newFormGroup);
    this.onAddActionFormGroup(formGroupIndex, this.getActions(formGroupIndex).length - 1, newFormGroup);
    return false;
  }
  removeActionGroup(formGroupIndex: number, index: number) {
    this.getActions(formGroupIndex).removeAt(index);
    this.onRemoveActionFormGroup(formGroupIndex, index);
    return false;
  }
  onAddActionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  }
  onRemoveActionFormGroup(mainIndex: number, index: number) {
  }
  /** End Action Form */

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          formGroup.get('ObjectName').setValue(selectedData.Name);
          // formGroup.get('ObjectPhone').setValue(selectedData.Phone);
          // formGroup.get('ObjectEmail').setValue(selectedData.Email);
          // formGroup.get('ObjectAddress').setValue(selectedData.Address);

          if (selectedData['Phone'] && selectedData['Phone']['restricted']) formGroup.get('ObjectPhone')['placeholder'] = selectedData['Phone']['placeholder']; else formGroup.get('ObjectPhone').setValue(selectedData['Phone']);
          if (selectedData['Email'] && selectedData['Email']['restricted']) formGroup.get('ObjectEmail')['placeholder'] = selectedData['Email']['placeholder']; else formGroup.get('ObjectEmail').setValue(selectedData['Email']);
          if (selectedData['Address'] && selectedData['Address']['restricted']) formGroup.get('ObjectAddress')['placeholder'] = selectedData['Address']['placeholder']; else formGroup.get('ObjectAddress').setValue(selectedData['Address']);

          formGroup.get('ObjectIdentifiedNumber').setValue(selectedData.TaxCode);
          formGroup.get('ObjectBankName').setValue(selectedData.BankName);
          formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }
  }

  onPublisherChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          formGroup.get('PublisherName').setValue(selectedData.Name);
          // formGroup.get('ObjectPhone').setValue(selectedData.Phone);
          // formGroup.get('ObjectEmail').setValue(selectedData.Email);
          // formGroup.get('ObjectAddress').setValue(selectedData.Address);

          if (selectedData['Phone'] && selectedData['Phone']['restricted']) formGroup.get('PublisherPhone')['placeholder'] = selectedData['Phone']['placeholder']; else formGroup.get('PublisherPhone').setValue(selectedData['Phone']);
          if (selectedData['Email'] && selectedData['Email']['restricted']) formGroup.get('PublisherEmail')['placeholder'] = selectedData['Email']['placeholder']; else formGroup.get('PublisherEmail').setValue(selectedData['Email']);
          if (selectedData['Address'] && selectedData['Address']['restricted']) formGroup.get('PublisherAddress')['placeholder'] = selectedData['Address']['placeholder']; else formGroup.get('PublisherAddress').setValue(selectedData['Address']);

        }
      }
    }
  }

  // onShipperChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
  //   // console.info(item);

  //   if (!this.isProcessing) {
  //     if (selectedData && !selectedData['doNotAutoFill']) {

  //       // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
  //       if (selectedData.Code) {
  //         formGroup.get('ShipperName').setValue(selectedData.Name);
  //         // formGroup.get('ObjectPhone').setValue(selectedData.Phone);
  //         // formGroup.get('ObjectEmail').setValue(selectedData.Email);
  //         // formGroup.get('ObjectAddress').setValue(selectedData.Address);

  //         if (selectedData['Phone'] && selectedData['Phone']['restricted']) formGroup.get('ShipperPhone')['placeholder'] = selectedData['Phone']['placeholder']; else formGroup.get('ShipperPhone').setValue(selectedData['Phone']);
  //         if (selectedData['Email'] && selectedData['Email']['restricted']) formGroup.get('ShipperEmail')['placeholder'] = selectedData['Email']['placeholder']; else formGroup.get('ShipperEmail').setValue(selectedData['Email']);
  //         if (selectedData['Address'] && selectedData['Address']['restricted']) formGroup.get('ShipperAddress')['placeholder'] = selectedData['Address']['placeholder']; else formGroup.get('ShipperAddress').setValue(selectedData['Address']);

  //       }
  //     }
  //   }
  // }

  onContactChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          formGroup.get('ContactName').setValue(selectedData.Name);
          // formGroup.get('ContactPhone').setValue(selectedData.Phone);
          // formGroup.get('ContactEmail').setValue(selectedData.Email);
          // formGroup.get('ContactAddress').setValue(selectedData.Address);

          if (selectedData['Phone'] && selectedData['Phone']['restricted']) formGroup.get('ContactPhone')['placeholder'] = selectedData['Phone']['placeholder']; else formGroup.get('ContactPhone').setValue(selectedData['Phone']);
          if (selectedData['Email'] && selectedData['Email']['restricted']) formGroup.get('ContactEmail')['placeholder'] = selectedData['Email']['placeholder']; else formGroup.get('ContactEmail').setValue(selectedData['Email']);
          if (selectedData['Address'] && selectedData['Address']['restricted']) formGroup.get('ContactAddress')['placeholder'] = selectedData['Address']['placeholder']; else formGroup.get('ContactAddress').setValue(selectedData['Address']);

          formGroup.get('ContactIdentifiedNumber').setValue(selectedData.TaxCode);
          // formGroup.get('ObjectBankName').setValue(selectedData.BankName);
          // formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }
  }

  /** Choose product event */
  onSelectProduct(detail: FormGroup, selectedData: ProductModel, parentForm: FormGroup) {
    console.log(selectedData);
    if (selectedData) {
      detail.get('Description').setValue(selectedData.Name);
      // if (parentForm.get('PriceTable').value) {
      // this.apiService.getPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-tables/getProductPriceByUnits', {
      //   priceTable: this.cms.getObjectId(parentForm.get('PriceTable').value),
      //   product: this.cms.getObjectId(selectedData),
      //   includeUnit: true,
      // }).then(rs => {
      // console.log(rs);
      if (selectedData.Units)
        // detail['unitList'] = selectedData.Unit;
        if (selectedData.Units) {
          detail['unitList'] = selectedData.Units;
          // const detaultUnit = selectedData.Units.find(f => f['IsDefaultSales'] === true);
          // if (detaultUnit) {
          // const choosed = rs.find(f => f.UnitCode === detaultUnit.id);
          detail.get('Unit').setValue('');
          // setTimeout(() => detail.get('Unit').setValue(detaultUnit.id), 0);
          setTimeout(() => {
            // detail.get('Price').setValue(choosed.Price);
            this.toMoney(parentForm, detail);
          }, 0);
          // }
        } else {
          detail['unitList'] = this.adminProductService.unitList$.value;
        }
      // });
      // } else {
      //   detail['unitList'] = this.cms.unitList;
      //   const detaultUnit = selectedData.Units?.find(f => f['IsDefaultSales'] === true);
      //   if (detaultUnit) {
      //     detail.get('Unit').setValue(detaultUnit);
      //   }
      // }
    } else {
      detail.get('Description').setValue('');
      detail.get('Unit').setValue('');
    }
    return false;
  }

  /** Choose unit event */
  onSelectUnit(detail: FormGroup, selectedData: UnitModel, formItem: FormGroup) {
    if (selectedData && selectedData.Price !== null) {
      detail.get('Price').setValue(selectedData.Price);
      this.toMoney(formItem, detail);
    }
    return false;
  }

  calculatToMoney(detail: FormGroup) {
    let toMoney = detail.get('Quantity').value * detail.get('Price').value;
    // let tax = detail.get('Tax').value;
    // if (tax) {
    //   if (typeof tax === 'string') {
    //     tax = this.taxList.filter(t => t.Code === tax)[0];
    //   }
    //   toMoney += toMoney * tax.Tax / 100;
    // }
    return toMoney;
  }

  toMoney(formItem: FormGroup, detail: FormGroup) {
    detail.get('ToMoney').setValue(this.calculatToMoney(detail));

    // Call culate total
    // const details = this.getDetails(formItem);
    // let total = 0;
    // for (let i = 0; i < details.controls.length; i++) {
    //   total += this.calculatToMoney(details.controls[i] as FormGroup);
    // }
    // formItem.get('_total').setValue(total);
    this.calulateTotal(formItem);
    return false;
  }

  calulateTotal(formItem: FormGroup) {
    this.cms.takeUntil('calulcate_sales_price_report', 300).then(rs => {
      let total = 0;
      const details = this.getDetails(formItem);
      for (let i = 0; i < details.controls.length; i++) {
        total += this.calculatToMoney(details.controls[i] as FormGroup);
      }
      formItem.get('_total').setValue(total);
    });
  }


  async preview(formItem: FormGroup) {
    const data: SalesPriceReportModel = formItem.value;
    for (const detail of data.Details) {
      detail['Tax'] = this.cms.getObjectText(this.taxList.find(t => t.Code === this.cms.getObjectId(detail['Tax'])), 'Lable2');
      detail['Unit'] = this.cms.getObjectText(this.unitList.find(f => f.id === this.cms.getObjectId(detail['Unit'])));
    };
    this.cms.openDialog(CollaboratorOrderPrintComponent, {
      context: {
        title: 'Xem trước',
        mode: 'preview',
        sourceOfDialog: 'form',
        data: [data],
        onSaveAndClose: (priceReport: SalesPriceReportModel) => {
          this.saveAndClose();
        },
        onSaveAndPrint: (priceReport: SalesPriceReportModel) => {
          this.save();
        },
      },
    });
    return false;
  }

  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      for (const detail of item.Details) {
        if (typeof detail.AccessNumbers == 'string') {
          detail.AccessNumbers = detail?.AccessNumbers.trim().split('\n').filter(f => !!f).map(ac => {
            if (/^127/.test(ac)) {
              return { id: ac, text: ac };
            }
            const acd = this.cms.decompileAccessNumber(ac);
            return acd.accessNumber;
          });
        }
      }
    }
    return data;
  }

  // getRawFormData() {
  //   const data = super.getRawFormData();

  //   return data;
  // }

  // customIcons: CustomIcon[] = [{
  //   icon: 'plus-square-outline', title: this.cms.translateText('Common.addNewProduct'), status: 'success', action: (formGroupCompoent:FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
  //     this.cms.openDialog(ProductFormComponent, {
  //       context: {
  //         inputMode: 'dialog',
  //         // inputId: ids,
  //         onDialogSave: (newData: ProductModel[]) => {
  //           console.log(newData);
  //           // const formItem = formGroupComponent.formGroup;
  //           const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.cms.getObjectId(unit?.Unit), text: this.cms.getObjectText(unit?.Unit) })) };
  //           formGroup.get('Product').patchValue(newProduct);
  //           this.onSelectProduct(formGroup, newProduct, option.parentForm)
  //         },
  //         onDialogClose: () => {

  //         },
  //       },
  //       closeOnEsc: false,
  //       closeOnBackdropClick: false,
  //     });
  //   }
  // }];

  openCreateNewProductForm(array: FormArray, index: number, name: string) {

  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.cms.previewVoucher(relativeVocher.type, relativeVocher);
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.cms.getObjectId(relativeVocher)));
    return false;
  }

  // getRawFormData() {
  //   const data = super.getRawFormData();
  //   for (const item of data.array) {
  //     item['Page'] = this.collaboratorService.currentpage$.value;
  //   }
  //   return data;
  // }

  // async save(): Promise<ProductModel[]> {
  //   if (!this.collaboratorService?.currentpage$?.value) {
  //     this.cms.toastService.show(this.cms.translateText('Common.error'), 'Bạn chưa chọn trang mà sản phẩm sẽ được khai báo !', {
  //       status: 'danger',
  //     });
  //   }
  //   return super.save();
  // }

  // onChangePage(page: CollaboratorPageModel) {
  //   this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
  // }

  saveAndClose(formItem?: FormGroup) {
    // const createMode = !this.isEditMode;
    if (this.cms.getObjectId(formItem?.value.State) == 'PROCESSING') {
      this.save().then(rs => {
        // this.goback();
        // if (this.previewAfterSave || (this.previewAfterCreate && createMode)) {
        //   this.preview(this.makeId(rs[0]), 'list', 'print');
        // }
        this.cms.showDialog('Chốt đơn', 'Bạn có muốn chuyển sang trạng thái chốt đơn ?', [
          {
            label: 'Trở về',
            status: 'basic',
            action: () => {

            }
          },
          {
            label: 'Chốt đơn',
            status: 'success',
            action: () => {
              this.apiService.putPromise(this.apiPath + '/' + this.id[0], { changeState: 'APPROVED' }, rs).then(rs => {
                this.cms.toastService.show(`Đơn hàng ${rs[0].Code} đã được chốt`, 'Đã chốt đơn', { status: 'success' })
                this.goback();
              });
            }
          },
        ])
      });
    } else {
      this.save().then(rs => this.goback());
    }
    return false;
  }

}
