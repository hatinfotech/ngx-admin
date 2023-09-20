import { CollaboratorAddonStrategyModel, CollaboratorAddonStrategyPublisherModel } from '../../../../models/collaborator.model';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ProductModel, ProductUnitModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CollaboratorService } from '../../collaborator.service';
import { ChangeDetectorRef } from '@angular/core';
import { CollaboratorAddonStrategyPublisherFormComponent } from '../publisher-form/collaborator-addon-strategy-publisher-form.component';
import { ColDef, ColumnApi, GridApi, IRowNode } from '@ag-grid-community/core';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgDynamicListComponent } from '../../../general/ag-dymanic-list/ag-dymanic-list.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { CollaboratorPublisherListComponent } from '../../publisher/collaborator-publisher-list/collaborator-publisher-list.component';
import { RootServices } from '../../../../services/root.services';
@Component({
  selector: 'ngx-collaborator-addon-strategy-form',
  templateUrl: './collaborator-addon-strategy-form.component.html',
  styleUrls: ['./collaborator-addon-strategy-form.component.scss'],
  providers: [
    CurrencyPipe
  ]
})
export class CollaboratorAddonStrategyFormComponent extends DataManagerFormComponent<CollaboratorAddonStrategyModel> implements OnInit {


  componentName: string = 'CollaboratorAddonStrategyFormComponent';
  idKey = ['Code'];
  apiPath = '/collaborator/addon-strategies';
  baseFormUrl = '/collaborator/addon-strategy/form';
  themeName = this.themeService.currentTheme == 'default' ? '' : this.themeService.currentTheme;
  unitList: ProductUnitModel[] = [];

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref?: NbDialogRef<CollaboratorAddonStrategyFormComponent>,
    public collaboratorService?: CollaboratorService,
    public themeService?: NbThemeService,
    public onDetectChangeRef?: ChangeDetectorRef
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);


    const $this = this;
    /** AG-Grid */
    this.columnDefs = [
      {
        ...agMakeSelectionColDef(this.cms),
        headerName: 'STT',
        field: 'Id',
        valueGetter: 'node.data.Publisher',
      },
      {
        ...agMakeImageColDef(this.cms),
        headerName: 'Avatar',
        field: 'Avatar',
        width: 100,
      },
      {
        headerName: 'Sku',
        field: 'Sku',
        width: 100,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        pinned: 'left',
      },
      {
        headerName: 'Tên CTV',
        field: 'PublisherName',
        width: 400,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'CKADDON',
        field: 'Level1CommissionRatio',
        width: 1024,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'right',
      },
      // {
      //   headerName: 'Thưởng tuần',
      //   field: 'Level1WeeklyAwardRatio',
      //   width: 150,
      //   filter: 'agTextColumnFilter',
      //   cellRenderer: AgTextCellRenderer,
      //   // pinned: 'right',
      // },
      // {
      //   headerName: 'Thưởng tháng',
      //   field: 'Level1MonthlyAwardRatio',
      //   width: 150,
      //   filter: 'agTextColumnFilter',
      //   cellRenderer: AgTextCellRenderer,
      //   // pinned: 'right',
      // },
      // {
      //   headerName: 'Thưởng quý',
      //   field: 'Level1QuarterlyAwardRatio',
      //   width: 150,
      //   filter: 'agTextColumnFilter',
      //   cellRenderer: AgTextCellRenderer,
      //   // pinned: 'right',
      // },
      // {
      //   headerName: 'Thưởng năm',
      //   field: 'Level1YearlyAwardRatio',
      //   width: 150,
      //   filter: 'agTextColumnFilter',
      //   cellRenderer: AgTextCellRenderer,
      //   // pinned: 'right',
      // },
      {
        ...agMakeCommandColDef(null, this.cms, false, (params) => {
          this.gridApi.applyTransaction({ remove: [params] });
        }, false, [
          {
            name: 'setting',
            title: 'Cài đặt',
            icon: 'settings-2-outline',
            status: 'primary',
            outline: false,
            action: async (params) => {
              this.cms.openDialog(CollaboratorAddonStrategyPublisherFormComponent, {
                context: {
                  data: [
                    params.node.data,
                  ],
                  onDialogSave(newData) {
                    console.log(newData);
                    let currentNode: IRowNode = $this.gridApi.getRowNode($this.cms.getObjectId(params.data.Publisher));
                    currentNode.setData(newData[0]);
                  },
                }
              });
              return true;
            }
          },
        ]),
        // width: 123,
        headerName: 'Lệnh',
      },
    ];
    /** End AG-Grid */
  }

  /** AG-Grid */
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public columnDefs: ColDef[];
  public gridParams;

  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadList();
  }

  loadList(callback?: (list: CollaboratorAddonStrategyPublisherModel[]) => void) {
    if (this.gridApi) {
      let publishers: CollaboratorAddonStrategyPublisherModel[] = (this.array.controls[0].get('Publishers').value || []).map((publisher: CollaboratorAddonStrategyPublisherModel) => {
        return publisher;
      });
      this.gridApi.setRowData(publishers);
    }
  }
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

  async loadCache() {
    // iniit category
    // this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', { limit: 'nolimit' })).map(cate => ({ id: cate.Code, text: cate.Name })) as any;
    // this.groupList = (await this.apiService.getPromise<ProductGroupModel[]>('/admin-product/groups', { limit: 'nolimit' })).map(cate => ({ id: cate.Code, text: cate.Name })) as any;
    // this.productList = (await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { limit: 100, includeIdText: true }));
  }

  getRequestId(callback: (id?: string[]) => void) {
    if (this.mode === 'page') {
      super.getRequestId(callback);
    } else {
      callback(this.inputId);
    }
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    await this.loadCache();
    return super.init().then(rs => {
      return rs;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: ProductModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includePublishers'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: ProductModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ProductModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      if (this.gridApi) {
        this.loadList();
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });
  }

  makeNewFormGroup(data?: ProductModel): FormGroup {
    const currentDate = new Date();
    const newForm = this.formBuilder.group({
      Code: { value: '', disabled: true },
      Title: ['', Validators.required],
      Page: [this.collaboratorService.currentpage$.value, Validators.required],
      DateRange: [[Date.today(), Date.today().next().month()], Validators.required],
      Publishers: [[]],
    });
    if (data) {
      data.DateRange = [data.DateOfStart, data.DateOfEnd];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ProductModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/admin-product/product/list']);
    } else {
      this.ref.close();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Execute api put */
  executePut(params: any, data: ProductModel[], success: (data: ProductModel[]) => void, error: (e: any) => void) {
    return super.executePut(params, data, success, error);
  }

  /** Execute api post */
  executePost(params: any, data: ProductModel[], success: (data: ProductModel[]) => void, error: (e: any) => void) {
    return super.executePost(params, data, success, error);
  }

  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      // Extract date range
      if (item.DateRange) {
        item.DateOfStart = item.DateRange[0];
        item.DateOfEnd = item.DateRange[1];
      }

      // Get details data from ag-grid
      item.Publishers = [];
      this.gridApi.forEachNode((rowNode, index) => {
        console.log(rowNode, index);
        const rawDetail = {};
        for (const prop in rowNode.data) {
          rawDetail[prop] = this.cms.getObjectId(rowNode.data[prop]);
        }
        item.Publishers.push(rawDetail);
      });
    }
    return data;
  }

  async save(): Promise<ProductModel[]> {
    return super.save();
  }

  onGridInit(component: AgDynamicListComponent<any>) {
    const $this = this;
    let actionButtonList = component.actionButtonList;
    // actionButtonList = actionButtonList.filter(f => f.name != 'choose');
    actionButtonList = [];
    actionButtonList.unshift({
      type: 'button',
      name: 'delete',
      title: 'Gở sản phẩm',
      status: 'danger',
      label: 'Gở',
      iconPack: 'eva',
      icon: 'minus-square-outline',
      size: 'medium',
      click: (event) => {
        const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();
        $this.gridApi.applyTransaction({ remove: selectedNodes.map(m => m.data) });

        return true;
      }
    });
    actionButtonList.unshift({
      type: 'button',
      name: 'add',
      title: 'Thêm CTV Bán Hàng',
      status: 'success',
      label: 'Thêm CTV Bán Hàng',
      iconPack: 'eva',
      icon: 'plus-square-outline',
      size: 'medium',
      click: (event) => {
        // const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

        this.cms.openDialog(CollaboratorPublisherListComponent, {
          context: {
            gridHeight: '90vh',
            onDialogChoose(chooseItems) {
              console.log(chooseItems);
              const newRowNodeTrans = $this.gridApi.applyTransaction({
                add: chooseItems.map(m => ({
                  id: m.Contact,
                  text: m.Name,
                  Publisher: m.Contact,
                  PublisherName: m.Name,
                  Avatar: m.Avatar,
                }))
              });
              console.log('New Row Node Trans: ', newRowNodeTrans);
            },
          }
        });

        return true;
      }
    });

    actionButtonList.unshift({
      type: 'button',
      name: 'settings',
      title: 'Cấu hình',
      status: 'primary',
      label: 'Cài đặt',
      iconPack: 'eva',
      icon: 'settings-2-outline',
      size: 'medium',
      click: (event) => {
        const selectedNodes: IRowNode[] = $this.gridApi.getSelectedNodes();

        // Setting for product
        if (selectedNodes && selectedNodes.length > 0) {
          this.cms.openDialog(CollaboratorAddonStrategyPublisherFormComponent, {
            context: {
              data: selectedNodes.map(m => m.data),
              onDialogSave(newData) {
                console.log(newData);
                for (const itemData of newData) {
                  let currentNode: IRowNode = $this.gridApi.getRowNode($this.cms.getObjectId(itemData.Publisher));
                  currentNode.setData(itemData);
                }
              },
            }
          });
        }

        return true;
      }
    });

    component.actionButtonList = actionButtonList;
  }
}
