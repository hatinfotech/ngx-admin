import { ContactListComponent } from './../../../contact/contact/contact-list/contact-list.component';
import { CurrencyPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbToastrService, NbDialogService, NbDialogRef, NbThemeService } from "@nebular/theme";
import { AgTextCellRenderer } from "../../../../lib/custom-element/ag-list/cell/text.component";
import { agMakeCommandColDef } from "../../../../lib/custom-element/ag-list/column-define/command.define";
import { agMakeImageColDef } from "../../../../lib/custom-element/ag-list/column-define/image.define";
import { agMakeSelectionColDef } from "../../../../lib/custom-element/ag-list/column-define/selection.define";
import { DataManagerFormComponent } from "../../../../lib/data-manager/data-manager-form.component";
import { ProductUnitModel, ProductModel } from "../../../../models/product.model";
import { ApiService } from "../../../../services/api.service";
import { CommonService } from "../../../../services/common.service";
import { AgDynamicListComponent } from "../../../general/ag-dymanic-list/ag-dymanic-list.component";
import { CollaboratorService } from "../../collaborator.service";
import { CollaboratorProductListComponent } from "../../product/collaborator-product-list/collaborator-product-list.component";
import { Model } from "../../../../models/model";
import { ColDef, ColumnApi, GridApi, IRowNode } from "@ag-grid-community/core";
import { ContactAllListComponent } from '../../../contact/contact-all-list/contact-all-list.component';

@Component({
  selector: 'ngx-collaborator-employee-group-form',
  templateUrl: './employee-group-form.component.html',
  styleUrls: ['./employee-group-form.component.scss'],
  providers: [
    CurrencyPipe
  ]
})
export class CollaboratorEmployeeGroupFormComponent extends DataManagerFormComponent<Model> implements OnInit {


  componentName: string = 'CollaboratorEmployeeGroupFormComponent';
  idKey = ['Code'];
  apiPath = '/collaborator/employee-groups';
  baseFormUrl = '/collaborator/employee-group/form';
  themeName = this.themeService.currentTheme == 'default' ? '' : this.themeService.currentTheme;
  unitList: ProductUnitModel[] = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref?: NbDialogRef<CollaboratorEmployeeGroupFormComponent>,
    public collaboratorService?: CollaboratorService,
    public themeService?: NbThemeService,
    public onDetectChangeRef?: ChangeDetectorRef
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);


    const $this = this;
    /** AG-Grid */
    this.columnDefs = [
      {
        ...agMakeSelectionColDef(this.cms),
        headerName: 'STT',
        field: 'Id',
        valueGetter: 'node.data.Employee',
      },
      {
        ...agMakeImageColDef(this.cms),
        headerName: 'Hình',
        field: 'Avatar',
        width: 100,
      },
      {
        headerName: 'ID',
        field: 'Employee',
        width: 180,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        pinned: 'left',
      },
      {
        headerName: 'Tên nhân viên',
        field: 'EmployeeName',
        width: 900,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'Vai trò',
        field: 'Role',
        width: 110,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        pinned: 'right',
      },
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
              // this.cms.openDialog(CollaboratorEmployeeGroupProductFormComponent, {
              //   context: {
              //     data: [
              //       params.node.data,
              //     ],
              //     onDialogSave(newData) {
              //       console.log(newData);
              //       let currentNode: IRowNode = $this.gridApi.getRowNode($this.cms.getObjectId(params.data.Product) + '-' + $this.cms.getObjectId(params.data.Unit));
              //       currentNode.setData(newData[0]);
              //     },
              //   }
              // });
              return true;
            }
          },
        ]),
        // width: 123,
        headerName: 'Lệnh',
      },
    ] as ColDef[];
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

  loadList(callback?: (list: Model[]) => void) {
    if (this.gridApi) {
      let details: Model[] = (this.array.controls[0].get('Employees').value || []).map((detail: Model) => {
        return detail;
      });
      this.gridApi.setRowData(details);
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
    params['includeEmployees'] = true;
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
      Name: ['', Validators.required],
      Description: [''],
      Employees: [[]],
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
      // if (item.DateRange) {
      //   item.DateOfStart = item.DateRange[0];
      //   item.DateOfEnd = item.DateRange[1];
      // }

      // Get details data from ag-grid
      item.Employees = [];
      this.gridApi.forEachNode((rowNode, index) => {
        console.log(rowNode, index);
        const rawDetail = {};
        for (const prop in rowNode.data) {
          rawDetail[prop] = this.cms.getObjectId(rowNode.data[prop]);
        }
        item.Employees.push(rawDetail);
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
      title: 'Gở nhân viên',
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
      title: 'Thêm nhân viên',
      status: 'success',
      label: 'Thêm',
      iconPack: 'eva',
      icon: 'plus-square-outline',
      size: 'medium',
      click: (event) => {
        // const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

        this.cms.openDialog(ContactAllListComponent, {
          context: {
            // rowMultiSelectWithClick: false,
            prepareApiParams: (params, getRowParams) => {
              params['includeGroups'] = true;
              params['eq_IsDeleted'] = false;
              params['eq_Groups'] = '[PUBLISHERSUPPORTER]';
              return params;
            },
            onDialogChoose(chooseItems) {
              console.log(chooseItems);
              const newRowNodeTrans = $this.gridApi.applyTransaction({
                add: chooseItems.map(m => ({
                  Employee: m.Code,
                  EmployeeName: m.Name,
                }))
              });
              console.log('New Row Node Trans: ', newRowNodeTrans);
            },
          }
        });

        return true;
      }
    });

    // actionButtonList.unshift({
    //   type: 'button',
    //   name: 'settings',
    //   title: 'Cấu hình',
    //   status: 'primary',
    //   label: 'Cài đặt',
    //   iconPack: 'eva',
    //   icon: 'settings-2-outline',
    //   size: 'medium',
    //   click: (event) => {
    //     const selectedNodes: IRowNode[] = $this.gridApi.getSelectedNodes();

    //     // Setting for product
    //     if (selectedNodes && selectedNodes.length > 0) {
    //       // this.cms.openDialog(CollaboratorEmployeeGroupProductFormComponent, {
    //       //   context: {
    //       //     data: selectedNodes.map(m => m.data),
    //       //     onDialogSave(newData) {
    //       //       console.log(newData);
    //       //       for (const itemData of newData) {
    //       //         let currentNode: IRowNode = $this.gridApi.getRowNode($this.cms.getObjectId(itemData.Product) + '-' + $this.cms.getObjectId(itemData.Unit));
    //       //         currentNode.setData(itemData);
    //       //       }
    //       //     },
    //       //   }
    //       // });
    //     }

    //     return true;
    //   }
    // });

    component.actionButtonList = actionButtonList;
  }
}
