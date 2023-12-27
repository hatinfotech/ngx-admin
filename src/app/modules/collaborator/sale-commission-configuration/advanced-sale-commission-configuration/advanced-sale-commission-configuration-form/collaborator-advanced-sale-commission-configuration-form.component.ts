import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { DataManagerFormComponent } from '../../../../../lib/data-manager/data-manager-form.component';
import { ProductModel, ProductUnitModel } from '../../../../../models/product.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
import { CollaboratorService } from '../../../collaborator.service';
import { ChangeDetectorRef } from '@angular/core';
import { ColDef, ColumnApi, GridApi, IRowNode } from '@ag-grid-community/core';
import { AgTextCellRenderer } from '../../../../../lib/custom-element/ag-list/cell/text.component';
import { CollaboratorAdvancedSaleCommissionConfigurationModel, CollaboratorAdvancedSaleCommissionConfigurationSellerModel, CollaboratorBasicSaleCommissionConfigurationProductModel } from '../../../../../models/collaborator.model';
import { agMakeCommandColDef } from '../../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeImageColDef } from '../../../../../lib/custom-element/ag-list/column-define/image.define';
import { agMakeSelectionColDef } from '../../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgDynamicListComponent } from '../../../../general/ag-dymanic-list/ag-dymanic-list.component';
import { CollaboratorProductListComponent } from '../../../product/collaborator-product-list/collaborator-product-list.component';
import { RootServices } from '../../../../../services/root.services';
import { CollaboratorBasicStrategyProductFormComponent } from '../../../basic-strategy/product-form/collaborator-basic-strategy-product-form.component';
import { ContactAllListComponent } from '../../../../contact/contact-all-list/contact-all-list.component';
@Component({
  selector: 'ngx-collaborator-advanced-sale-commission-configuration-form',
  templateUrl: './collaborator-advanced-sale-commission-configuration-form.component.html',
  styleUrls: ['./collaborator-advanced-sale-commission-configuration-form.component.scss'],
  providers: [
    CurrencyPipe
  ]
})
export class CollaboratorAdvancedSaleCommissionConfigurationFormComponent extends DataManagerFormComponent<CollaboratorAdvancedSaleCommissionConfigurationModel> implements OnInit {


  componentName: string = 'CollaboratorAdvancedSaleCommissionConfigurationFormComponent';
  idKey = ['Code'];
  apiPath = '/collaborator/advanced-sale-commission-configurations';
  baseFormUrl = '/collaborator/advance-strategy/form';
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
    public ref?: NbDialogRef<CollaboratorAdvancedSaleCommissionConfigurationFormComponent>,
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
        valueGetter: 'node.data.Seller',
      },
      {
        ...agMakeImageColDef(this.cms),
        headerName: 'Avatar',
        field: 'Avatar',
        width: 100,
      },
      {
        headerName: 'Seller',
        field: 'Seller',
        width: 100,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'Tên CTV',
        field: 'SellerName',
        width: 400,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      // {
      //   headerName: 'CKNC',
      //   field: 'Level1CommissionRatio',
      //   width: 110,
      //   filter: 'agTextColumnFilter',
      //   cellRenderer: AgTextCellRenderer,
      //   // pinned: 'right',
      // },
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
        headerName: 'Sản phẩm',
        field: 'Products',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'right',
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
              this.cms.openDialog(CollaboratorBasicStrategyProductFormComponent, {
                context: {
                  data: [
                    params.node.data,
                  ],
                  onDialogSave(newData) {
                    console.log(newData);
                    let currentNode: IRowNode = $this.gridApi.getRowNode($this.cms.getObjectId(params.data.Product) + '-' + $this.cms.getObjectId(params.data.Unit));
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

    this.productsColumnDefs = [
      {
        ...agMakeSelectionColDef(this.cms),
        headerName: 'STT',
        field: 'Id',
        valueGetter: 'node.data.Product',
      },
      {
        ...agMakeImageColDef(this.cms),
        headerName: 'Hình',
        field: 'FeaturePicture',
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
        headerName: 'Product',
        field: 'Product',
        width: 100,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'Tên sản phẩm',
        field: 'ProductName',
        width: 250,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'ĐVT',
        field: 'Unit',
        width: 110,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'right',
      },
      {
        headerName: 'CKNC',
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
          $this.productGridApi.applyTransaction({ remove: [params] });
          $this.updateSellerProducts();
        }, false, [
          {
            name: 'setting',
            title: 'Cài đặt',
            icon: 'settings-2-outline',
            status: 'primary',
            outline: false,
            action: async (params) => {
              this.cms.openDialog(CollaboratorBasicStrategyProductFormComponent, {
                context: {
                  data: [
                    params.node.data,
                  ],
                  onDialogSave(newData) {
                    console.log(newData);
                    let currentNode: IRowNode = $this.productGridApi.getRowNode($this.cms.getObjectId(params.data.Product) + '-' + $this.cms.getObjectId(params.data.Unit));
                    currentNode && currentNode.setData({ ...currentNode.data, ...newData[0] });
                    $this.updateSellerProducts();
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
  public productGridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public columnDefs: ColDef[];
  public productsColumnDefs: ColDef[];
  public gridParams;

  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadList();
  }
  onProductGridReady(params) {
    this.productGridApi = params.api;
    this.productGridApi.setRowData([]);
  }

  loadList(callback?: (list: CollaboratorBasicSaleCommissionConfigurationProductModel[]) => void) {
    if (this.gridApi) {
      let publishers: CollaboratorAdvancedSaleCommissionConfigurationSellerModel[] = (this.array.controls[0].get('Sellers').value || []).map((publisher: CollaboratorAdvancedSaleCommissionConfigurationSellerModel) => {
        if (!publisher.Products) {
          publisher.Products = [];
        }
        publisher.Products.map(product => {
          product['id'] = this.cms.getObjectId(product.Product) + '-' + this.cms.getObjectId(product.Unit);
          product['text'] = product.ProductName + '/' + this.cms.getObjectText(product.Unit) + '/' + product.Level1CommissionRatio;
        });
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
    params['includeSellers'] = true;
    params['includeProducts'] = true;
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
      Sellers: [[]],
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
      item.Sellers = [];
      this.gridApi.forEachNode((rowNode, index) => {
        console.log(rowNode, index);
        const rawDetail = {};
        for (const prop in rowNode.data) {
          rawDetail[prop] = this.cms.getObjectId(rowNode.data[prop]);
        }
        item.Sellers.push(rawDetail);
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
      title: 'Gở Seller',
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
      title: 'Thêm Seller',
      status: 'success',
      label: 'Thêm Seller',
      iconPack: 'eva',
      icon: 'plus-square-outline',
      size: 'medium',
      click: (event) => {
        // const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

        this.cms.openDialog(ContactAllListComponent, {
          context: {
            prepareApiParams: (params) => {
              params['eq_Groups'] = '[PUBLISHERSUPPORTER]';
              params['includeGroups'] = true;
              return params;
            },
            gridHeight: '90vh',
            onDialogChoose(chooseItems) {
              console.log(chooseItems);
              const newRowNodeTrans = $this.gridApi.applyTransaction({
                add: chooseItems.map(m => ({
                  id: m.Code,
                  text: m.Name,
                  Seller: m.Code,
                  SellerName: m.Name,
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
    //       this.cms.openDialog(CollaboratorBasicStrategyProductFormComponent, {
    //         context: {
    //           data: selectedNodes.map(m => m.data),
    //           onDialogSave(newData) {
    //             console.log(newData);
    //             for (const itemData of newData) {
    //               let currentNode: IRowNode = $this.gridApi.getRowNode($this.cms.getObjectId(itemData.Product) + '-' + $this.cms.getObjectId(itemData.Unit));
    //               currentNode.setData(itemData);
    //             }
    //           },
    //         }
    //       });
    //     }

    //     return true;
    //   }
    // });

    component.actionButtonList = actionButtonList;
  }

  onProductGridInit(component: AgDynamicListComponent<any>) {
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
      disabled: () => !$this.productExtendData?.publisher,
      click: (event) => {
        const selectedNodes: IRowNode[] = $this.productGridApi.getSelectedNodes();
        $this.gridApi.applyTransaction({ remove: selectedNodes.map(m => m.data) });

        return true;
      }
    });
    actionButtonList.unshift({
      type: 'button',
      name: 'add',
      title: 'Thêm sản phẩm',
      status: 'success',
      label: 'Thêm sản phẩm',
      iconPack: 'eva',
      icon: 'plus-square-outline',
      size: 'medium',
      disabled: () => !$this.productExtendData?.publisher,
      click: (event) => {
        // const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

        this.cms.openDialog(CollaboratorProductListComponent, {
          context: {
            // gridHeight: '90vh',
            prepareApiParams: (params) => {
              params['onlyBusinessProducts'] = false;
              return params;
            },
            onDialogChoose(chooseItems) {
              console.log(chooseItems);
              const newRowNodeTrans = $this.productGridApi.applyTransaction({
                add: chooseItems.map(m => ({
                  id: m.Code,
                  text: m.Name,
                  Product: m.Code,
                  ProductName: m.Name,
                  Sku: m.Sku,
                  Unit: m.Unit,
                  Pictures: m.Pictures,
                  FeaturePicture: m.FeaturePicture,
                }))
              });
              console.log('New Row Node Trans: ', newRowNodeTrans);
              $this.updateSellerProducts();
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
      disabled: () => !$this.productExtendData?.publisher,
      click: (event) => {
        const selectedNodes: IRowNode[] = $this.productGridApi.getSelectedNodes();

        // Setting for product
        if (selectedNodes && selectedNodes.length > 0) {
          this.cms.openDialog(CollaboratorBasicStrategyProductFormComponent, {
            context: {
              data: selectedNodes.map(m => m.data),
              onDialogSave(newData) {
                console.log(newData);
                for (const itemData of newData) {
                  let currentNode: IRowNode = $this.productGridApi.getRowNode($this.cms.getObjectId(itemData.Product) + '-' + $this.cms.getObjectId(itemData.Unit));
                  currentNode.setData({ ...currentNode.data, ...itemData });
                }

                $this.updateSellerProducts();
              },
            }
          });
        }

        return true;
      }
    });

    component.actionButtonList = actionButtonList;
  }

  productExtendData: any = {};
  selectedSellerNode: IRowNode<CollaboratorAdvancedSaleCommissionConfigurationSellerModel> = null;
  onSellersSelected(nodes: IRowNode<CollaboratorAdvancedSaleCommissionConfigurationSellerModel>[]) {
    console.log('On Sellers selected: ', nodes);
    if (nodes.length == 1) {
      // Load relative products
      this.productGridApi.setRowData(nodes[0].data.Products);
      this.productExtendData.publisher = nodes[0].data;
      this.selectedSellerNode = nodes[0];
    } else {
      // Clear relative products
      this.productExtendData.publisher = null;
      this.selectedSellerNode = null;
      this.productGridApi.setRowData([]);
    }
  }

  updateSellerProducts() {
    if (this.selectedSellerNode) {
      const products = [];
      this.productGridApi.forEachNode(rowNode => products.push({ ...rowNode.data, id: this.cms.getObjectId(rowNode.data['Product']) + '-' + this.cms.getObjectId(rowNode.data['Unit']), text: rowNode.data['ProductName'] + '/' + this.cms.getObjectText(rowNode.data['Unit']) + '/' + rowNode.data['Level1CommissionRatio'] }));
      this.selectedSellerNode.setData({ ...this.selectedSellerNode.data, Products: products });
    }
  }
}
