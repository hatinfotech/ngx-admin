import { SalesB2bQuotationDetailModel } from './../../../../models/sales.model';
import { agMakeNumberColDef } from './../../../../lib/custom-element/ag-list/column-define/number.define';
import { agMakeCurrencyColDef } from './../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeTextColDef } from './../../../../lib/custom-element/ag-list/column-define/text.define';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ProductUnitModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CollaboratorService } from '../../../collaborator/collaborator.service';
import { ChangeDetectorRef } from '@angular/core';
import { ColDef, ColumnApi, GridApi, IRowNode } from '@ag-grid-community/core';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgDynamicListComponent } from '../../../general/ag-dymanic-list/ag-dymanic-list.component';
import { CollaboratorProductListComponent } from '../../../collaborator/product/collaborator-product-list/collaborator-product-list.component';
import { RootServices } from '../../../../services/root.services';
import { ProductionOrderCostClassificationModel, ProductionOrderDistributedCostModel, ProductionOrderFinishedGoodsModel, ProductionOrderMaterialModel, ProductionOrderModel, WarehouseGoodsDeliveryNoteDetailModel, WarehouseGoodsDeliveryNoteModel } from '../../../../models/warehouse.model';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { AgNumberCellInput } from '../../../../lib/custom-element/ag-list/cell/input/number.component';
import { AccCostClassificationListComponent } from '../../../accounting/cost-classification/cost-classification-list/cost-classification-list.component';
import { AgSelect2CellInput } from '../../../../lib/custom-element/ag-list/cell/input/select2.component';
import { WarehouseGoodsDeliveryNoteFormComponent } from '../../goods-delivery-note/warehouse-goods-delivery-note-form/warehouse-goods-delivery-note-form.component';
@Component({
  selector: 'ngx-production-order-form',
  templateUrl: './production-order-form.component.html',
  styleUrls: ['./production-order-form.component.scss'],
  providers: [
    CurrencyPipe
  ]
})
export class ProductionOrderFormComponent extends DataManagerFormComponent<ProductionOrderModel> implements OnInit {

  componentName: string = 'ProductionOrderFormComponent';
  idKey = ['Code'];
  baseFormUrl = '/warehouse/production-order/form';
  apiPath = '/warehouse/production-orders';
  themeName = this.themeService.currentTheme == 'default' ? '' : this.themeService.currentTheme;
  unitList: ProductUnitModel[] = [];

  patchedDataAfterSave = false;

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref?: NbDialogRef<ProductionOrderFormComponent>,
    public collaboratorService?: CollaboratorService,
    public themeService?: NbThemeService,
    public onDetectChangeRef?: ChangeDetectorRef
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);


    const $this = this;
    /** AG-Grid */
    // Define columns for Cost Classifications
    this.columnDefsForClassifications = [
      {
        ...agMakeSelectionColDef(this.cms),
        headerName: '#',
        field: 'Id',
        valueGetter: 'node.data.CostClassification',
        width: 60,
      },
      {
        ...agMakeTextColDef(this.cms),
        headerName: 'ID',
        field: 'CostClassification',
        width: 150,
        // pinned: 'left',
        valueGetter: params => this.cms.getObjectId(params.node?.data?.CostClassification),
      },
      {
        headerName: 'Khoản mục chi phí',
        field: 'CostClassificationLabel',
        width: 400,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        ...agMakeCurrencyColDef(this.cms),
        headerName: 'Số dư',
        field: 'Balance',
        width: 200,
      },
      {
        // ...agMakeNumberColDef(this.cms),
        headerName: 'Tỷ lệ phân bổ',
        field: 'DistributedPercent',
        width: 200,
        type: 'rightAligned',
        cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
        filter: 'agNumberColumnFilter',
        cellRenderer: AgNumberCellInput,
        // pinned: 'right',
        cellRendererParams: {
          digits: 4,
          // changed: (value, params?: { node: IRowNode<ProductionOrderFinishedGoodsModel> }) => {
          //   // const distributePercent = parseFloat(value);
          //   // const balance = parseFloat(params.node.data.Balance);
          //   // params.node.updateData({ ...params.node.data, DistributedValue: balance * (distributePercent / 100) });
          // },
          keyup: (value, params?: { node: IRowNode<ProductionOrderFinishedGoodsModel> }) => {
            const distributePercent = parseFloat(value);
            const balance = parseFloat(params.node.data.Balance);
            params.node.updateData({ ...params.node.data, DistributedValue: balance * (distributePercent / 100) });
          },
        },
      },
      {
        headerName: 'Giá trị phân bổ',
        field: 'DistributedValue',
        width: 200,
        type: 'rightAligned',
        cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
        filter: 'agNumberColumnFilter',
        cellRenderer: AgNumberCellInput,
        // pinned: 'right',
        cellRendererParams: {
          // changed: (value, params?: { node: IRowNode<ProductionOrderFinishedGoodsModel> }) => {
          //   // const distributePercent = parseFloat(value);
          //   // const balance = parseFloat(params.node.data.Balance);
          //   // params.node.updateData({ ...params.node.data, DistributedValue: balance * (distributePercent / 100) });
          // },
          keyup: (value, params?: { node: IRowNode<ProductionOrderFinishedGoodsModel> }) => {
            const distributeValue = parseFloat(value);
            const balance = parseFloat(params.node.data.Balance);
            params.node.updateData({ ...params.node.data, DistributedPercent: distributeValue / balance * 100 });
          },
        },
      },
      {
        headerName: 'Cách thức phân bổ',
        field: 'DistributedType',
        width: 300,
        filter: 'agTextColumnFilter',
        cellRenderer: AgSelect2CellInput,
        cellRendererParams: {
          list: [
            { id: 'DIRECTMATERIAL', text: 'Nguyên vật liệu trực tiếp' },
            { id: 'DIRECTLABOUR', text: 'Nhân công trực tiếp' },
            { id: 'DIRECTCOST', text: 'Chi phí trực tiếp (NVLTT, NCTT)' },
            { id: 'REVENUE', text: 'Doanh thu' },
            { id: 'BUDGETED', text: 'Định mức' },
            { id: 'PRODUCTQUANTITY', text: 'Số lượng thành phẩm' },
          ]
        }
        // pinned: 'right',
      },
      {
        headerName: 'SystemUuid',
        field: 'SystemUuid',
        width: 0,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
      },
      {
        ...agMakeCommandColDef(null, this.cms, false, (params) => {
          $this.costClassificationGridApi.applyTransaction({ remove: [params] });
          // $this.updateCostClassificationGrid();
        }, false, [
        ]),
        // width: 123,
        headerName: 'Lệnh',
      },
    ];

    // Define columns for Finished Goods
    this.columnDefsForFinishedGoods = [
      {
        ...agMakeSelectionColDef(this.cms),
        headerName: '#',
        field: 'Id',
        valueGetter: 'node.data.FinishedGoods',
        width: 60,
      },
      {
        ...agMakeImageColDef(this.cms),
        headerName: 'Hình',
        field: 'FeaturePicture',
        width: 100,
        pinned: 'left'
      },
      {
        ...agMakeTextColDef(this.cms),
        headerName: 'ID/Sku',
        field: 'FinishedGoodsSku',
        width: 150,
        valueGetter: params => `SKU:${params.node?.data?.FinishedGoods?.Sku} ID:${this.cms.getObjectId(params.node?.data?.FinishedGoods)}`,
        // pinned: 'left',

      },
      {
        headerName: 'Thành phẩm',
        field: 'FinishedGoods',
        width: 300,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        ...agMakeCurrencyColDef(this.cms),
        headerName: 'CP NVL',
        field: 'MaterialCost',
        width: 150,
      },
      {
        ...agMakeCurrencyColDef(this.cms),
        headerName: 'CP Phân bổ',
        field: 'DistributedCost',
        width: 150,
      },
      {
        ...agMakeCurrencyColDef(this.cms),
        headerName: 'Giá thành',
        field: 'CostOfProduction',
        width: 150,
      },
      {
        headerName: 'SL',
        field: 'Quantity',
        width: 150,
        type: 'rightAligned',
        cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
        filter: 'agNumberColumnFilter',
        cellRenderer: AgNumberCellInput,
        cellRendererParams: {
          keyup: (value, params?: { node: IRowNode<ProductionOrderFinishedGoodsModel> }) => {
            const finishedGoodsQuantity = parseFloat(value as any);
            // const materials = params.node.data?.Materials;
            // if (materials) {
            for (const material of params.node.data?.Materials) {
              // const materialsTemplate = params.node.data.FinishedGoods.ProductParts;
              // const materialTemplate = materialsTemplate.find(f => this.cms.getObjectId(f.PartProduct) == this.cms.getObjectId(material.Material));
              // material.Budgeted = parseFloat(materialTemplate.Quantity as any);
              // if (materialTemplate) {
              material.FinishedGoodsQuantity = finishedGoodsQuantity;
              material.Quantity = material.Budgeted * finishedGoodsQuantity;
              // }
            }
            params.node.updateData({ ...params.node.data });
            // console.log(materials);
            // this.updateMaterialForFinishedGoods();
            // setTimeout(() => {
            console.log(params.node.data.Materials);
            this.updateMaterialList(params.node);
            // }, 3000);
            // }
          }
        },
        pinned: 'right',
      },
      {
        headerName: 'ĐVT',
        field: 'Unit',
        pinned: 'right',
        width: 100,
        cellRenderer: AgTextCellRenderer,
        filter: AgSelect2Filter,
        filterParams: {
          select2Option: {
            placeholder: 'Chọn ĐVT...',
            allowClear: true,
            width: '100%',
            dropdownAutoWidth: true,
            minimumInputLength: 0,
            withThumbnail: false,
            keyMap: {
              id: 'id',
              text: 'text',
            },
            multiple: true,
            logic: 'OR',
            data: this.rsv.adminProductService.unitList$.value,
          }
        },
      },
      {
        headerName: 'Nguyên vật liệu',
        field: 'Materials',
        width: 1024,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'right',
        valueGetter: params => {
          return params.data.Materials?.map(m => this.cms.getObjectText(m.Material)).join(', ');
        }
      },
      {
        headerName: 'SystemUuid',
        field: 'SystemUuid',
        width: 0,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
      },
      {
        headerName: 'TotalMaterialCost',
        field: 'TotalMaterialCost',
        width: 0,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
      },
      {
        ...agMakeCommandColDef(null, this.cms, false, (params) => {
          this.finishedGoodsGridApi.applyTransaction({ remove: [params] });
        }, false, [
        ]),
        // width: 123,
        headerName: 'Lệnh',
      },
    ];

    // Define columns for Materials
    this.columnDefsForMaterials = [
      {
        ...agMakeSelectionColDef(this.cms),
        headerName: '#',
        field: 'Id',
        valueGetter: 'node.data.Material',
        width: 60,
      },
      {
        ...agMakeImageColDef(this.cms),
        headerName: 'Hình',
        field: 'FeaturePicture',
        width: 100,
        pinned: 'left',
      },
      {
        ...agMakeTextColDef(this.cms),
        headerName: 'Sku/ID',
        field: 'Sku',
        width: 100,
        // pinned: 'left',
        valueGetter: params => `SKU:${params.node?.data?.Material?.Sku} ID:${this.cms.getObjectId(params.node?.data?.Material)}`,
      },
      {
        headerName: 'Nguyên vật liệu',
        field: 'Material',
        width: 250,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'Định mức',
        field: 'Budgeted',
        width: 150,
        type: 'rightAligned',
        cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
        filter: 'agNumberColumnFilter',
        cellRenderer: AgNumberCellInput,
        pinned: 'right',
        cellRendererParams: {
          keyup: (value, params?: { node: IRowNode<ProductionOrderMaterialModel> }) => {
            const budgeted = parseFloat(value as any);
            const finishedGoodsQuantity = parseFloat(params.node.data.FinishedGoodsQuantity as any);
            params.node.updateData({ ...params.node.data, Quantity: finishedGoodsQuantity * budgeted });
            // return false;
          }
        }
      },
      {
        ...agMakeCurrencyColDef(this.cms),
        headerName: 'CPNVL/TP',
        field: 'Cost',
        width: 150,
      },
      {
        headerName: 'SL Yêu cầu',
        field: 'Quantity',
        width: 150,
        type: 'rightAligned',
        cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
        filter: 'agNumberColumnFilter',
        cellRenderer: AgNumberCellInput,
        pinned: 'right',
      },
      {
        headerName: 'ĐVT',
        field: 'Unit',
        width: 110,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        pinned: 'right',
      },
      {
        headerName: 'FinishedGoods',
        field: 'FinishedGoods',
        width: 250,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'FinishedGoodsUnit',
        field: 'FinishedGoodsUnit',
        width: 250,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'SystemUuid',
        field: 'SystemUuid',
        width: 0,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
      },
      {
        ...agMakeCommandColDef(null, this.cms, false, (params) => {
          $this.materialGridApi.applyTransaction({ remove: [params] });
          $this.updateMaterialForFinishedGoods();
        }, false, [
        ]),
        // width: 123,
        headerName: 'Lệnh',
      },
    ];

    // Define columns for Distributed costs
    this.columnDefsForDistributedCost = [
      {
        ...agMakeSelectionColDef(this.cms),
        headerName: '#',
        field: 'Id',
        valueGetter: 'node.data.CostClassification',
        width: 60,
      },
      {
        ...agMakeTextColDef(this.cms),
        headerName: 'ID',
        field: 'CostClassification',
        width: 150,
        // pinned: 'left',
        valueGetter: params => this.cms.getObjectId(params.node?.data?.CostClassification),
      },
      {
        headerName: 'Khoản mục chi phí',
        field: 'CostClassificationLabel',
        width: 400,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        ...agMakeCurrencyColDef(this.cms),
        headerName: 'CP Phân bổ',
        field: 'Cost',
        width: 150,
        pinned: 'right'
      },
      {
        ...agMakeNumberColDef(this.cms),
        headerName: 'Tỷ lệ phân bổ',
        field: 'DistributedPercent',
        width: 100,
        pinned: 'right'
      },
      {
        headerName: 'FinishedGoods',
        field: 'FinishedGoods',
        width: 0,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'FinishedGoodsUnit',
        field: 'FinishedGoodsUnit',
        width: 0,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'SystemUuid',
        field: 'SystemUuid',
        width: 0,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
      },
      {
        ...agMakeCommandColDef(null, this.cms, false, (params) => {
          $this.distributedCostGridApi.applyTransaction({ remove: [params] });
          $this.updateDistributedCostForFinishedGoods();
        }, false, [
        ]),
        // width: 123,
        headerName: 'Lệnh',
      },
    ];
    /** End AG-Grid */
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
    // init category
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
  executeGet(params: any, success: (resources: ProductionOrderModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeFinishedGoods'] = true;
    params['includeMaterials'] = true;
    params['includeDistributedCosts'] = true;
    params['includeFeaturePicture'] = true;
    params['includeFinishedGoodsInfo'] = true;
    params['includeCostClassifications'] = true;
    params['includeRelativeVouchers'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: ProductionOrderModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ProductionOrderModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      if (this.finishedGoodsGridApi) {
        this.updateFinishedGoodsGrid();
      }
      if (this.costClassificationGridApi) {
        this.updateCostClassificationGrid();
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });
  }

  makeNewFormGroup(data?: ProductionOrderModel): FormGroup {
    const currentDate = new Date();
    const newForm = this.formBuilder.group({
      Code: { value: null, disabled: true },
      Title: [null, Validators.required],
      Description: [null],
      Page: [this.collaboratorService.currentpage$.value],
      Manager: [this.collaboratorService.currentpage$.value],
      DateRange: [[Date.today(), Date.today().next().month()]],
      FinishedGoods: [[]],
      CostClassifications: [[]],
      RelativeVouchers: [],
    });
    if (data) {
      data.DateRange = [data.DateOfStart, data.DateOfEnd];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ProductionOrderModel): void {
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
  executePut(params: any, data: ProductionOrderModel[], success: (data: ProductionOrderModel[]) => void, error: (e: any) => void) {
    return super.executePut(params, data, success, error);
  }

  /** Execute api post */
  executePost(params: any, data: ProductionOrderModel[], success: (data: ProductionOrderModel[]) => void, error: (e: any) => void) {
    return super.executePost(params, data, success, error);
  }

  productExtendData: any = {};
  selectedFinishedGoodsNode: IRowNode<ProductionOrderFinishedGoodsModel> = null;
  onFinishedGoodsSelected(nodes: IRowNode<ProductionOrderFinishedGoodsModel>[]) {
    console.log('On FinishedGoods selected: ', nodes);
    if (nodes.length == 1) {
      // Load relative products
      this.materialGridApi.setRowData(nodes[0].data.Materials);
      this.distributedCostGridApi.setRowData(nodes[0].data.DistributedCosts);
      this.productExtendData.finishedGoodsItem = nodes[0].data;
      this.selectedFinishedGoodsNode = nodes[0];
    } else {
      // Clear relative products
      this.productExtendData.finishedGoodsItem = null;
      this.selectedFinishedGoodsNode = null;
      this.materialGridApi.setRowData([]);
      this.distributedCostGridApi.setRowData([]);
    }
  }

  updateMaterialForFinishedGoods() {
    if (this.selectedFinishedGoodsNode) {
      const products = [];
      this.materialGridApi.forEachNode(rowNode => products.push({
        ...rowNode.data,
      }));
      this.selectedFinishedGoodsNode.setData({ ...this.selectedFinishedGoodsNode.data, Materials: products });
    }
  }

  updateDistributedCostForFinishedGoods() {
    if (this.selectedFinishedGoodsNode) {
      const distributedCosts = [];
      this.distributedCostGridApi.forEachNode(rowNode => distributedCosts.push({
        ...rowNode.data,
      }));
      this.selectedFinishedGoodsNode.setData({ ...this.selectedFinishedGoodsNode.data, DistributedCosts: distributedCosts });
    }
  }

  /** Begin AG-Grid For Cost Classifications */
  public costClassificationGridParams;
  public columnDefsForClassifications: ColDef[];
  public costClassificationGridApi: GridApi;

  updateCostClassificationGrid(callback?: (list: ProductionOrderFinishedGoodsModel[]) => void) {
    if (this.costClassificationGridApi) {
      let costClassifications: ProductionOrderCostClassificationModel[] = (this.array.controls[0].get('CostClassifications').value || []).map((item: ProductionOrderCostClassificationModel) => {
        return item;
      });
      this.costClassificationGridApi.setRowData(costClassifications);
    }
  }

  onCostClassificationGridReady(params) {
    this.costClassificationGridParams = params;
    this.costClassificationGridApi = params.api;
    this.updateCostClassificationGrid();
  }

  onCostClassificationGridInit(component: AgDynamicListComponent<any>) {
    const $this = this;
    let actionButtonList = component.actionButtonList;
    component.defaultColDef = {
      ...component.defaultColDef,
      floatingFilter: false,
    };

    actionButtonList = [];
    actionButtonList.unshift({
      type: 'button',
      name: 'delete',
      title: 'Gở khoản mục CP',
      status: 'danger',
      label: 'Gở',
      iconPack: 'eva',
      icon: 'minus-square-outline',
      size: 'small',
      outline: true,
      click: (event) => {
        const selectedNodes: IRowNode[] = this.costClassificationGridApi.getSelectedNodes();
        $this.costClassificationGridApi.applyTransaction({ remove: selectedNodes.map(m => m.data) });

        return true;
      }
    });
    actionButtonList.unshift({
      type: 'button',
      name: 'add',
      title: 'Thêm khoản mục CP',
      status: 'success',
      label: 'Thêm',
      iconPack: 'eva',
      icon: 'plus-square-outline',
      size: 'small',
      outline: true,
      click: (event) => {
        this.cms.openDialog(AccCostClassificationListComponent, {
          context: {
            width: '90vw',
            height: '90vh',
            gridHeight: 'calc(90vh - 3.8rem)',
            inputQuery: {
              // eq_type: 'FINISHEDGOODS',
              // includeProductParts: true,
            },
            onDialogChoose(chooseItems) {
              console.log(chooseItems);
              const costClassifications = chooseItems.map(chooseItem => ({
                CostClassification: { id: chooseItem.Code, text: chooseItem.Name },
                CostClassificationLabel: chooseItem.Name,
                Balance: chooseItem.Balance,
                DistributedPercent: 100,
                DistributedValue: chooseItem.Balance,
                DistributedType: 'DIRECTMATERIAL',
              }));
              const newRowNodeTrans = $this.costClassificationGridApi.applyTransaction({
                add: costClassifications,
              });
              const listData = [];
              $this.costClassificationGridApi.forEachNode(rowNode => listData.push(rowNode.data));
              $this.array.controls[0].get('CostClassifications').setValue(listData);
              console.log('New Row Node Trans: ', newRowNodeTrans);
            },
          }
        });

        return true;
      }
    });
    // actionButtonList.unshift({
    //   type: 'button',
    //   name: 'delete',
    //   title: 'Phân bổ chi phí cho các thành phẩm',
    //   status: 'primary',
    //   label: 'Phân bổ chi phí',
    //   iconPack: 'eva',
    //   icon: 'flash-outline',
    //   size: 'small',
    //   outline: true,
    //   click: (event) => {

    //     const funishedGoods: ProductionOrderFinishedGoodsModel[] = [];
    //     this.finishedGoodsGridApi.forEachNode((rowNode: IRowNode<ProductionOrderFinishedGoodsModel>, index) => {
    //       funishedGoods.push(rowNode.data);
    //       for (const material of rowNode.data.Materials) {
    //         // material.Amount = material.Quantity * material.
    //       }
    //     });


    //     this.costClassificationGridApi.forEachNode((rowNode: IRowNode<ProductionOrderCostClassificationModel>, index) => {
    //       const distributedType = this.cms.getObjectId(rowNode.data?.DistributedType);
    //       if (distributedType == 'DIRECTMATERIAL') {

    //       }

    //     });
    //     return true;
    //   }
    // });

    component.actionButtonList = actionButtonList;
  }

  onCostClassificationSelected(nodes: IRowNode<ProductionOrderFinishedGoodsModel>[]) {
    console.log('On FinishedGoods selected: ', nodes);
  }
  /** End AG-Grid For Cost Classifications */

  /** AG-Grid For Finished Goods */
  public finishedGoodsGridApi: GridApi;
  public finishedGoodsGridColumnApi: ColumnApi;
  public columnDefsForFinishedGoods: ColDef[];
  public finishedGoodsGridParams;

  onFinishedGoodsGridReady(params) {
    this.finishedGoodsGridParams = params;
    this.finishedGoodsGridApi = params.api;
    this.finishedGoodsGridColumnApi = params.columnApi;
    this.updateFinishedGoodsGrid();
  }

  updateFinishedGoodsGrid(callback?: (list: ProductionOrderFinishedGoodsModel[]) => void) {
    if (this.finishedGoodsGridApi) {
      let finishedGoods: ProductionOrderFinishedGoodsModel[] = (this.array.controls[0].get('FinishedGoods').value || []).map((item: ProductionOrderFinishedGoodsModel) => {
        item.Materials?.map(material => {
          return material
        })
        return item;
      });
      this.finishedGoodsGridApi.setRowData(finishedGoods);
    }
  }

  onFinishedGoodsGridInit(component: AgDynamicListComponent<any>) {
    const $this = this;
    let actionButtonList = component.actionButtonList;
    // actionButtonList = actionButtonList.filter(f => f.name != 'choose');
    actionButtonList = [];
    actionButtonList.unshift({
      type: 'button',
      name: 'delete',
      title: 'Gở thành phẩm',
      status: 'danger',
      label: 'Gở',
      iconPack: 'eva',
      icon: 'minus-square-outline',
      size: 'small',
      outline: true,
      click: (event) => {
        const selectedNodes: IRowNode[] = this.finishedGoodsGridApi.getSelectedNodes();
        $this.finishedGoodsGridApi.applyTransaction({ remove: selectedNodes.map(m => m.data) });

        return true;
      }
    });
    actionButtonList.unshift({
      type: 'button',
      name: 'add',
      title: 'Thêm thành phẩm',
      status: 'success',
      label: 'Thêm',
      iconPack: 'eva',
      icon: 'plus-square-outline',
      size: 'small',
      outline: true,
      click: (event) => {
        // const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

        this.cms.openDialog(ProductListComponent, {
          context: {
            width: '90vw',
            height: '90vh',
            gridHeight: 'calc(90vh - 3.8rem)',
            inputQuery: {
              eq_type: 'FINISHEDGOODS',
              includeProductParts: true,
            },
            onDialogChoose(chooseItems) {
              console.log(chooseItems);
              const finishedGoods = chooseItems.map(chooseItem => ({
                FinishedGoods: {
                  ...chooseItem,
                  id: chooseItem.Code,
                  text: chooseItem.Name,
                  Sku: chooseItem.Sku,
                },
                FinishedGoodsName: chooseItem.Name,
                Unit: chooseItem.WarehouseUnit,
                Quantity: 1,
                Materials: chooseItem.ProductParts?.map(productPart => ({
                  ...productPart,
                  FeaturePicture: productPart.FeaturePicture,
                  Material: {
                    id: $this.cms.getObjectId(productPart.PartProduct),
                    text: productPart.PartProductName,
                    Sku: productPart.Sku
                  },
                  Unit: {
                    id: $this.cms.getObjectId(productPart.PartUnit),
                    text: productPart.PartUnitLabel,
                  },
                  FinishedGoods: {
                    id: chooseItem.Code,
                    text: chooseItem.Name,
                  },
                  FinishedGoodsUnit: chooseItem.WarehouseUnit,
                  Budgeted: productPart.Quantity,
                  Quantity: productPart.Quantity * 1,
                  FinishedGoodsQuantity: 1,
                })),
                FeaturePicture: chooseItem.FeaturePicture,
              }));
              const newRowNodeTrans = $this.finishedGoodsGridApi.applyTransaction({
                add: finishedGoods,
              });
              const listData = [];
              $this.finishedGoodsGridApi.forEachNode(rowNode => listData.push(rowNode.data));
              $this.array.controls[0].get('FinishedGoods').setValue(listData);
              console.log('New Row Node Trans: ', newRowNodeTrans);
            },
          }
        });

        return true;
      }
    });

    actionButtonList.unshift({
      type: 'button',
      name: 'delete',
      title: 'Tính giá thành',
      status: 'info',
      label: 'Tính giá thành',
      iconPack: 'eva',
      icon: 'flash-outline',
      size: 'small',
      outline: true,
      click: async (event) => {
        const relativeVouchers = this.array.controls[0].get('RelativeVouchers').value;

        // Get goods deliveriy notes from relative vouchers
        const goodsDeleiveryIds = [];
        for (const relativeVoucher of relativeVouchers) {
          if (relativeVoucher.type == 'GOODSDELIVERY') {
            goodsDeleiveryIds.push(this.cms.getObjectId(relativeVoucher));
          }
        }

        if (goodsDeleiveryIds.length > 0) {

          // Load goods delivery note details
          const goodsDeliveryNoteList = await this.apiService.getPromise<WarehouseGoodsDeliveryNoteModel[]>('/warehouse/goods-delivery-notes', { eq_Code: '[' + goodsDeleiveryIds.join(',') + ']', includeDetails: true });
          let goodsDeliveryDetials = [];
          for (const goodsDeliveryNote of goodsDeliveryNoteList) {
            goodsDeliveryDetials = [
              ...goodsDeliveryDetials,
              ...goodsDeliveryNote.Details,
            ];
          }

          // Calculate cost form materials
          const finishedGoods: ProductionOrderFinishedGoodsModel[] = [];
          let sumOfTotalMaterialCost = 0;
          this.finishedGoodsGridApi.forEachNode((rowNode: IRowNode<ProductionOrderFinishedGoodsModel>) => {
            let totalMaterialCost = 0;
            const finishedGoodsItem = rowNode.data;
            finishedGoods.push(finishedGoodsItem);
            for (const material of finishedGoodsItem?.Materials) {
              const goodsDeliveryDetial = goodsDeliveryDetials.find(f => this.cms.getObjectId(f.Product) == this.cms.getObjectId(material.Material) && this.cms.getObjectId(f.Unit) == this.cms.getObjectId(material.Unit));
              if (goodsDeliveryDetial) {
                material.Price = goodsDeliveryDetial.Price;
                material.Cost = material.Price * material.Budgeted;
                totalMaterialCost += material.Cost;
              }
            }
            // finishedGoods.CostOfProduction = materialCost / finishedGoods.Quantity;
            finishedGoodsItem.MaterialCost = totalMaterialCost;
            finishedGoodsItem.TotalMaterialCost = totalMaterialCost * parseFloat(finishedGoodsItem.Quantity as any);
            sumOfTotalMaterialCost += finishedGoodsItem.TotalMaterialCost;

            rowNode.updateData({ ...finishedGoodsItem });
            if (this.selectedFinishedGoodsNode) {
              this.updateMaterialList(this.selectedFinishedGoodsNode);
              // this.updateDistributedCostList(this.selectedFinishedGoodsNode);
            }
          });

          // finishedGoods



          // Distribute cost to finished goods
          this.finishedGoodsGridApi.forEachNode((rowNode1: IRowNode<ProductionOrderFinishedGoodsModel>) => {
            const finishedGoodsItem = rowNode1.data;
            finishedGoodsItem.DistributedCost = 0;
            finishedGoodsItem.CostOfProduction = finishedGoodsItem.MaterialCost;
            this.costClassificationGridApi.forEachNode((rowNode: IRowNode<ProductionOrderCostClassificationModel>) => {
              const distributedType = this.cms.getObjectId(rowNode.data.DistributedType);
              const costClassification = this.cms.getObjectId(rowNode.data.CostClassification);
              if (distributedType == 'DIRECTMATERIAL') {// Phân bổ theo nguyên liệu trực tiếp
                const distributedValue = parseFloat(rowNode.data.DistributedValue as any);
                if (distributedValue > 0) {

                  const materialCostRatio = (finishedGoodsItem.TotalMaterialCost / sumOfTotalMaterialCost) * 100;
                  if (!finishedGoodsItem.DistributedCosts) finishedGoodsItem.DistributedCosts = [];
                  let distributedCost: ProductionOrderDistributedCostModel = finishedGoodsItem.DistributedCosts.find(f => this.cms.getObjectId(f.CostClassification) == costClassification);
                  if (!distributedCost) {
                    distributedCost = {
                      ProductionOrder: finishedGoodsItem.ProductionOrder as any,
                      FinishedGoods: finishedGoodsItem.FinishedGoods,
                      FinishedGoodsUnit: finishedGoodsItem.Unit as any,
                      CostClassification: rowNode.data.CostClassification,
                      CostClassificationLabel: rowNode.data.CostClassificationLabel,
                      Cost: distributedValue * materialCostRatio / 100,
                      DistributedPercent: materialCostRatio,
                    };
                    finishedGoodsItem.DistributedCosts.push(distributedCost);
                  } else {
                    distributedCost.Cost = distributedValue * materialCostRatio / 100;
                    distributedCost.DistributedPercent = materialCostRatio;
                  }
                  finishedGoodsItem.DistributedCost += (distributedCost.Cost / parseFloat(finishedGoodsItem.Quantity as any));
                  finishedGoodsItem.CostOfProduction += finishedGoodsItem.DistributedCost;
                }
              }
            });

            setTimeout(() => {
              rowNode1.updateData({ ...finishedGoodsItem });
              if (this.selectedFinishedGoodsNode) {
                this.updateDistributedCostList(this.selectedFinishedGoodsNode);
              }
            }, 0);
          });




          // for (const finishedGoodsitem of finishedGoods) {
          // }
        }
        return true;
      }
    });
    actionButtonList.unshift({
      type: 'button',
      name: 'delete',
      title: 'Nhập kho thành phẩm',
      status: 'primary',
      label: 'Nhập kho thành phẩm',
      iconPack: 'ion',
      icon: 'arrow-down-a',
      size: 'small',
      outline: true,
      click: (event) => {

        return true;
      }
    });

    component.actionButtonList = actionButtonList;
  }
  /** End AG-Grid For Finished Goods */

  /** Begin AG-Grid For Materials */
  public materialGridApi: GridApi;
  public columnDefsForMaterials: ColDef[];

  onMaterialGridReady(params) {
    this.materialGridApi = params.api;
    this.materialGridApi.setRowData([]);
  }

  onMaterialGridInit(component: AgDynamicListComponent<any>) {
    const $this = this;
    let actionButtonList = component.actionButtonList;
    actionButtonList = [];
    actionButtonList.unshift({
      type: 'button',
      name: 'distribute',
      title: 'Thêm nguyên vật liệu',
      status: 'success',
      label: 'Thêm nguyên vật liệu',
      iconPack: 'eva',
      icon: 'plus-square-outline',
      size: 'small',
      outline: true,
      disabled: () => !$this.productExtendData?.finishedGoodsItem,
      click: (event) => {
        // const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

        this.cms.openDialog(CollaboratorProductListComponent, {
          context: {
            // gridHeight: '90vh',
            onDialogChoose(chooseItems) {
              console.log(chooseItems);
              const newRowNodeTrans = $this.materialGridApi.applyTransaction({
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
              $this.updateMaterialForFinishedGoods();
            },
          }
        });

        return true;
      }
    });

    actionButtonList.unshift({
      type: 'button',
      name: 'delete',
      title: 'Xuất kho nguyên vật liệu',
      status: 'primary',
      label: 'Xuất kho NVL',
      iconPack: 'ion',
      icon: 'arrow-up-a',
      size: 'small',
      outline: true,
      click: (event) => {
        const selectedNodes: IRowNode[] = this.finishedGoodsGridApi.getSelectedNodes();
        try {
          const productionOrderId = this.array.controls[0].get('Code').value;
          const productionOrderTitle = this.array.controls[0].get('Title').value;
          if (!productionOrderId) {
            throw new Error('Lệnh sản xuất chưa được lưu !');
          }

          const deliveryGoodsList: WarehouseGoodsDeliveryNoteDetailModel[] = [];
          // Tao danh sách NVL cần xuất kho
          this.finishedGoodsGridApi.forEachNode((rowNode: IRowNode<ProductionOrderFinishedGoodsModel>, index) => {
            for (const material of rowNode.data.Materials) {
              const detail = deliveryGoodsList.find(f => this.cms.getObjectId(f.Product) == this.cms.getObjectId(material.Material));
              if (detail) {
                detail.Quantity += parseFloat(material.Quantity as any);
              } else {
                if (!material.SystemUuid) {
                  throw new Error('Có nguyên vật liệu mới chưa được lưu, bạn hãy lưu phiếu và thực hiện lại thao tác này !');
                }
                deliveryGoodsList.push({
                  Type: 'PRODUCT',
                  Product: material.Material,
                  Unit: material.Unit,
                  Description: this.cms.getObjectText(material.Material),
                  Quantity: parseFloat(material.Quantity as any),
                  Business: [
                    { id: 'MATERIALDELIVERY', text: 'Xuất nguyên vật liệu' },
                  ],
                  RelateDetail: `PRODUCTIONORDER/${productionOrderId}/MATERIAL/${material.SystemUuid}`,
                });
              }
            }
          });


          // Open goods delivery form

          this.cms.openDialog(WarehouseGoodsDeliveryNoteFormComponent, {
            context: {
              data: [
                {
                  Title: `Xuất kho cho lệnh sản xuất ${productionOrderId} - ${productionOrderTitle}`,
                  Details: deliveryGoodsList,
                  RelativeVouchers: [
                    { id: productionOrderId, text: productionOrderTitle, type: 'PRODUCTIONORDER' }
                  ]
                }
              ]
            }
          });
        } catch (err) {
          this.cms.showError(err);
        }
        return true;
      }
    });

    component.actionButtonList = actionButtonList;
  }

  updateMaterialList(finishedGoodsNode: IRowNode<ProductionOrderFinishedGoodsModel>) {
    this.materialGridApi.setRowData(finishedGoodsNode.data.Materials);
  }
  /** End AG-Grid For Materials */

  /** Begin AG-Grid For Distributed Cost */
  public distributedCostGridApi: GridApi;
  public columnDefsForDistributedCost: ColDef[];

  onDistributedCostGridReady(params) {
    this.distributedCostGridApi = params.api;
    this.distributedCostGridApi.setRowData([]);
  }

  onDistributedCostGridInit(component: AgDynamicListComponent<any>) {
    const $this = this;
    let actionButtonList = component.actionButtonList;
    actionButtonList = [];
    // actionButtonList.unshift({
    //   type: 'button',
    //   name: 'distribute',
    //   title: 'Thêm nguyên vật liệu',
    //   status: 'success',
    //   label: 'Thêm nguyên vật liệu',
    //   iconPack: 'eva',
    //   icon: 'plus-square-outline',
    //   size: 'small',
    //   outline: true,
    //   disabled: () => !$this.productExtendData?.finishedGoodsItem,
    //   click: (event) => {
    //     // const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

    //     this.cms.openDialog(CollaboratorProductListComponent, {
    //       context: {
    //         // gridHeight: '90vh',
    //         onDialogChoose(chooseItems) {
    //           console.log(chooseItems);
    //           const newRowNodeTrans = $this.materialGridApi.applyTransaction({
    //             add: chooseItems.map(m => ({
    //               id: m.Code,
    //               text: m.Name,
    //               Product: m.Code,
    //               ProductName: m.Name,
    //               Sku: m.Sku,
    //               Unit: m.Unit,
    //               Pictures: m.Pictures,
    //               FeaturePicture: m.FeaturePicture,
    //             }))
    //           });
    //           console.log('New Row Node Trans: ', newRowNodeTrans);
    //           $this.updateMaterialForFinishedGoods();
    //         },
    //       }
    //     });

    //     return true;
    //   }
    // });

    // actionButtonList.unshift({
    //   type: 'button',
    //   name: 'delete',
    //   title: 'Xuất kho nguyên vật liệu',
    //   status: 'primary',
    //   label: 'Xuất kho NVL',
    //   iconPack: 'ion',
    //   icon: 'arrow-up-a',
    //   size: 'small',
    //   outline: true,
    //   click: (event) => {
    //     const selectedNodes: IRowNode[] = this.finishedGoodsGridApi.getSelectedNodes();
    //     try {
    //       const productionOrderId = this.array.controls[0].get('Code').value;
    //       const productionOrderTitle = this.array.controls[0].get('Title').value;
    //       if (!productionOrderId) {
    //         throw new Error('Lệnh sản xuất chưa được lưu !');
    //       }

    //       const deliveryGoodsList: WarehouseGoodsDeliveryNoteDetailModel[] = [];
    //       // Tao danh sách NVL cần xuất kho
    //       this.finishedGoodsGridApi.forEachNode((rowNode: IRowNode<ProductionOrderFinishedGoodsModel>, index) => {
    //         for (const material of rowNode.data.Materials) {
    //           const detail = deliveryGoodsList.find(f => this.cms.getObjectId(f.Product) == this.cms.getObjectId(material.Material));
    //           if (detail) {
    //             detail.Quantity += parseFloat(material.Quantity as any);
    //           } else {
    //             if (!material.SystemUuid) {
    //               throw new Error('Có nguyên vật liệu mới chưa được lưu, bạn hãy lưu phiếu và thực hiện lại thao tác này !');
    //             }
    //             deliveryGoodsList.push({
    //               Type: 'PRODUCT',
    //               Product: material.Material,
    //               Unit: material.Unit,
    //               Description: this.cms.getObjectText(material.Material),
    //               Quantity: parseFloat(material.Quantity as any),
    //               Business: [
    //                 { id: 'MATERIALDELIVERY', text: 'Xuất nguyên vật liệu' },
    //               ],
    //               RelateDetail: `PRODUCTIONORDER/${productionOrderId}/MATERIAL/${material.SystemUuid}`,
    //             });
    //           }
    //         }
    //       });


    //       // Open goods delivery form

    //       this.cms.openDialog(WarehouseGoodsDeliveryNoteFormComponent, {
    //         context: {
    //           data: [
    //             {
    //               Title: `Xuất kho cho lệnh sản xuất ${productionOrderId} - ${productionOrderTitle}`,
    //               Details: deliveryGoodsList,
    //               RelativeVouchers: [
    //                 { id: productionOrderId, text: productionOrderTitle, type: 'PRODUCTIONORDER' }
    //               ]
    //             }
    //           ]
    //         }
    //       });
    //     } catch (err) {
    //       this.cms.showError(err);
    //     }
    //     return true;
    //   }
    // });

    component.actionButtonList = actionButtonList;
  }

  updateDistributedCostList(finishedGoodsNode: IRowNode<ProductionOrderFinishedGoodsModel>) {
    this.distributedCostGridApi.setRowData(finishedGoodsNode.data.DistributedCosts);
  }
  /** End AG-Grid For Distributed Cost */


  /** Hight performance config */
  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      // Extract date range
      if (item.DateRange) {
        item.DateOfStart = item.DateRange[0];
        item.DateOfEnd = item.DateRange[1];
      }

      // Get finished goods data from ag-grid
      item.FinishedGoods = [];
      this.finishedGoodsGridApi.forEachNode((rowNode, index) => {
        console.log(rowNode, index);
        const finishedGoodsItem: ProductionOrderFinishedGoodsModel = {};
        for (const prop in rowNode.data) {
          finishedGoodsItem[prop] = this.cms.getCleanObject(rowNode.data[prop]);
        }
        delete finishedGoodsItem.FeaturePicture;
        for (const materialItem of finishedGoodsItem.Materials) {
          delete materialItem.FeaturePicture;
        }
        item.FinishedGoods.push(finishedGoodsItem);
      });

      // Get cost classification data from ag-grid
      item.CostClassifications = [];
      this.costClassificationGridApi.forEachNode((rowNode, index) => {
        console.log(rowNode, index);
        const costClassification: ProductionOrderCostClassificationModel = {};
        for (const prop in rowNode.data) {
          costClassification[prop] = this.cms.getCleanObject(rowNode.data[prop]);
        }
        item.CostClassifications.push(costClassification);
      });
    }
    return data;
  }

  /** Override: Auto update SystemUuid for detail form item */
  onItemAfterSaveSubmit(formItemData: ProductionOrderModel, index: number, method: string) {
    const result = super.onItemAfterSaveSubmit(formItemData, index, method);
    // Update data for UnitConversions
    if (result && formItemData.FinishedGoods) {
      const finishedGoods: ProductionOrderFinishedGoodsModel[] = [];
      this.finishedGoodsGridApi.forEachNode(rowNode => finishedGoods.push(rowNode.data));
      for (const f in finishedGoods) {
        finishedGoods[f].SystemUuid = formItemData.FinishedGoods[f]?.SystemUuid;
        for (const m in finishedGoods[f].Materials) {
          finishedGoods[f].Materials[m].SystemUuid = formItemData.FinishedGoods[f]?.Materials[m]?.SystemUuid;
        }
        for (const m in finishedGoods[f].DistributedCosts) {
          finishedGoods[f].DistributedCosts[m].SystemUuid = formItemData.FinishedGoods[f]?.DistributedCosts[m]?.SystemUuid;
        }
      }
      this.array.controls[index].get('FinishedGoods').setValue(finishedGoods);
      this.updateFinishedGoodsGrid();
    }
    if (result && formItemData.CostClassifications) {
      const costClassifications: ProductionOrderCostClassificationModel[] = [];
      this.costClassificationGridApi.forEachNode(rowNode => costClassifications.push(rowNode.data));
      for (const f in costClassifications) {
        costClassifications[f].SystemUuid = formItemData.FinishedGoods[f]?.SystemUuid;
      }
      this.array.controls[index].get('CostClassifications').setValue(costClassifications);
      this.updateFinishedGoodsGrid();
    }
    return result;
  }
  /** End Hight performance config */

  async save(): Promise<ProductionOrderModel[]> {
    return super.save();
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.cms.previewVoucher(this.cms.getObjectId(relativeVocher.type), relativeVocher);
    return false;
  }
}
