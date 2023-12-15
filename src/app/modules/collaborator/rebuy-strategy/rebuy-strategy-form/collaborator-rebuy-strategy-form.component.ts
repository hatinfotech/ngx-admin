import { CollaboratorRebuyStrategyProductModel, CollaboratorRebuyStrategyPublisherModel } from '../../../../models/collaborator.model';
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
import { ColDef, ColumnApi, GridApi, IRowNode } from '@ag-grid-community/core';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { CollaboratorAddonStrategyPublisherModel, CollaboratorRebuyStrategyModel, CollaboratorBasicStrategyProductModel } from '../../../../models/collaborator.model';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgDynamicListComponent } from '../../../general/ag-dymanic-list/ag-dymanic-list.component';
import { CollaboratorBasicStrategyProductFormComponent } from '../../basic-strategy/product-form/collaborator-basic-strategy-product-form.component';
import { CollaboratorPublisherListComponent } from '../../publisher/collaborator-publisher-list/collaborator-publisher-list.component';
import { CollaboratorProductListComponent } from '../../product/collaborator-product-list/collaborator-product-list.component';
import { RootServices } from '../../../../services/root.services';
@Component({
  selector: 'ngx-collaborator-rebuy-strategy-form',
  templateUrl: './collaborator-rebuy-strategy-form.component.html',
  styleUrls: ['./collaborator-rebuy-strategy-form.component.scss'],
  providers: [
    CurrencyPipe
  ]
})
export class CollaboratorRebuyStrategyFormComponent extends DataManagerFormComponent<CollaboratorRebuyStrategyModel> implements OnInit {


  componentName: string = 'CollaboratorRebuyStrategyFormComponent';
  idKey = ['Code'];
  apiPath = '/collaborator/rebuy-strategies';
  baseFormUrl = '/collaborator/rebuy-strategy/form';
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
    public ref?: NbDialogRef<CollaboratorRebuyStrategyFormComponent>,
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
      {
        headerName: 'CTV Bán Hàng',
        field: 'Publishers',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'right',
      },
      {
        headerName: 'SystemUuid',
        field: 'SystemUuid',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'right',
      },
      {
        ...agMakeCommandColDef(null, this.cms, false, (params) => {
          $this.publisherGridApi.applyTransaction({ remove: [params] });
          $this.updateProductPublishers();
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
                    let currentNode: IRowNode = $this.publisherGridApi.getRowNode($this.cms.getObjectId(params.data.Product) + '-' + $this.cms.getObjectId(params.data.Unit));
                    currentNode && currentNode.setData({ ...currentNode.data, ...newData[0] });
                    $this.updateProductPublishers();
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
        valueGetter: 'node.data.Publisher',
      },
      {
        ...agMakeImageColDef(this.cms),
        headerName: 'Avatar',
        field: 'Avatar',
        width: 100,
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
        headerName: 'SystemUuid',
        field: 'SystemUuid',
        width: 400,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
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
    /** End AG-Grid */
  }

  /** AG-Grid */
  public gridApi: GridApi;
  public publisherGridApi: GridApi;
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
    this.publisherGridApi = params.api;
    this.publisherGridApi.setRowData([]);
  }

  loadList(callback?: (list: CollaboratorBasicStrategyProductModel[]) => void) {
    if (this.gridApi) {
      let products: CollaboratorRebuyStrategyProductModel[] = (this.array.controls[0].get('Products').value || []).map((product: CollaboratorRebuyStrategyProductModel) => {
        if (!product.Publishers) {
          product.Publishers = [];
        }
        product.Publishers.map(publisher => {
          publisher['id'] = this.cms.getObjectId(publisher.Publisher);
          publisher['text'] = publisher.PublisherName + '/' + publisher.Level1CommissionRatio;
        });
        return product;
      });
      this.gridApi.setRowData(products);
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
      Products: [[]],
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
      item.Products = [];
      this.gridApi.forEachNode((rowNode, index) => {
        console.log(rowNode, index);
        const rawDetail = {};
        for (const prop in rowNode.data) {
          rawDetail[prop] = this.cms.getObjectId(rowNode.data[prop]);
        }
        item.Products.push(rawDetail);
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
      title: 'Gở Sản phẩm',
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
      title: 'Thêm Sản phẩm',
      status: 'success',
      label: 'Thêm Sản phẩm',
      iconPack: 'eva',
      icon: 'plus-square-outline',
      size: 'medium',
      click: (event) => {
        // const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

        this.cms.openDialog(CollaboratorProductListComponent, {
          context: {
            gridHeight: '90vh',
            onDialogChoose(chooseItems) {
              console.log(chooseItems);
              const newRowNodeTrans = $this.gridApi.applyTransaction({
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
      title: 'Gở CTV Bán Hàng',
      status: 'danger',
      label: 'Gở',
      iconPack: 'eva',
      icon: 'minus-square-outline',
      size: 'medium',
      disabled: () => !$this.publisherExtendData?.product,
      click: (event) => {
        const selectedNodes: IRowNode[] = $this.publisherGridApi.getSelectedNodes();
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
      disabled: () => !$this.publisherExtendData?.product,
      click: (event) => {
        // const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

        this.cms.openDialog(CollaboratorPublisherListComponent, {
          context: {
            gridHeight: '90vh',
            onDialogChoose(chooseItems) {
              console.log(chooseItems);
              const newRowNodeTrans = $this.publisherGridApi.applyTransaction({
                add: chooseItems.map(m => ({
                  id: m.Contact,
                  text: m.Name,
                  Publisher: m.Contact,
                  PublisherName: m.Name,
                  Avatar: m.Avatar,
                }))
              });
              console.log('New Row Node Trans: ', newRowNodeTrans);
              $this.updateProductPublishers();
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
      disabled: () => !$this.publisherExtendData?.product,
      click: (event) => {
        const selectedNodes: IRowNode[] = $this.publisherGridApi.getSelectedNodes();

        // Setting for product
        if (selectedNodes && selectedNodes.length > 0) {
          this.cms.openDialog(CollaboratorBasicStrategyProductFormComponent, {
            context: {
              data: selectedNodes.map(m => m.data),
              onDialogSave(newData) {
                console.log(newData);
                for (const itemData of newData) {
                  let currentNode: IRowNode = $this.publisherGridApi.getRowNode($this.cms.getObjectId(itemData.Product) + '-' + $this.cms.getObjectId(itemData.Unit));
                  currentNode.setData({ ...currentNode.data, ...itemData });
                }

                $this.updateProductPublishers();
              },
            }
          });
        }

        return true;
      }
    });

    component.actionButtonList = actionButtonList;
  }

  publisherExtendData: any = {};
  selectedProductNode: IRowNode<CollaboratorRebuyStrategyProductModel> = null;
  onProductsSelected(nodes: IRowNode<CollaboratorRebuyStrategyProductModel>[]) {
    console.log('On Publishers selected: ', nodes);
    if (nodes.length == 1) {
      // Load relative products
      this.publisherGridApi.setRowData(nodes[0].data.Publishers);
      this.publisherExtendData.product = nodes[0].data;
      this.selectedProductNode = nodes[0];
    } else {
      // Clear relative products
      this.publisherExtendData.product = null;
      this.selectedProductNode = null;
      this.publisherGridApi.setRowData([]);
    }
  }

  updateProductPublishers() {
    if (this.selectedProductNode) {
      const publisher = [];
      this.publisherGridApi.forEachNode(rowNode => publisher.push({ ...rowNode.data, id: this.cms.getObjectId(rowNode.data['Publisher']), text: rowNode.data['PublisherName'] + '/' + rowNode.data['Level1CommissionRatio'] }));
      this.selectedProductNode.setData({ ...this.selectedProductNode.data, Publishers: publisher });
    }
  }
}
