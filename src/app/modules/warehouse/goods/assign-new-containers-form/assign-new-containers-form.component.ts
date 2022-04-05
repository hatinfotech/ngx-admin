import { WarehouseGoodsContainerFormComponent } from '../../goods-container/warehouse-goods-container-form/warehouse-goods-container-form.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { FormControl } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ProductModel } from '../../../../models/product.model';
import { WarehouseGoodsContainerModel, GoodsModel } from '../../../../models/warehouse.model';
import { rejects } from 'assert';

@Component({
  selector: 'ngx-assign-new-containers-form',
  templateUrl: './assign-new-containers-form.component.html',
  styleUrls: ['./assign-new-containers-form.component.scss'],
})
export class AssignNewContainerFormComponent extends BaseComponent implements OnInit {

  componentName: string = 'AssignContainerFormComponent';
  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputGoodsList: ProductModel[];
  @Input() onDialogSave: (newData: ProductModel[]) => void;
  @Input() onDialogClose: () => void;

  containersFormControl = new FormControl();

  goodsContainerList: (WarehouseGoodsContainerModel & { id?: string, text?: string })[] = [];
  select2OptionForShelf = {
    placeholder: 'Chọn kệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        this.apiService.getPromise('/warehouse/goods-containers', { filter_Name: settings.data['term'] ? settings.data['term'] : '', includeIdText: true, eq_Type: 'SHELF', limit: 20 }).then(rs => {
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
          results: data,
        };
      },
    },
  };

  processing = false;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<AssignNewContainerFormComponent>,
  ) {
    super(commonService, router, apiService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  async init() {
    // this.goodsContainerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, limit: 'nolimit' })).map(item => ({ id: item.Code, text: item.Path })).sort((a, b) => a.text.localeCompare(b.text));
    // this.goodsContainerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includeIdText: true, includeFindOrder: true, sort_Path: 'asc', limit: 'nolimit', select: 'Code, Name, FindOrder', 'Warehouse' }));
    return super.init();
  }

  async createAndAssign() {
    let choosedContainer: string = this.commonService.getObjectId(this.containersFormControl.value);
    this.processing = true;
    let rs = null;
    for (const inputGoods of this.inputGoodsList) {
      if (choosedContainer) {
        rs = await this.apiService.postPromise<GoodsModel[]>('/warehouse/goods-containers', {}, [{
          Parent: choosedContainer,
          Warehouse: this.containersFormControl.value?.Warehouse,
          Type: 'DRAWERS',
        }]).then(async rs => {
          await this.apiService.putPromise<GoodsModel[]>('/warehouse/goods', { id: inputGoods.Code, updateContainerDescription: true, assignContainers: rs[0].Code }, [
            {
              Code: inputGoods.Code,
              WarehouseUnit: this.commonService.getObjectId(inputGoods.WarehouseUnit)
            }
          ]).then(rs => {

          });
          return rs;
        });
      }

    }
    this.onDialogSave(rs.map(m => {
      m.Containers = m.Containers;
      return m;
    }));
    this.processing = false;
    this.close();

  }

  revokeCategories() {
    const choosedContainers: (WarehouseGoodsContainerModel & { id?: string, text?: string })[] = this.containersFormControl.value;
    if (choosedContainers && choosedContainers.length > 0) {
      this.processing = true;
      const ids = [];
      const updateList: GoodsModel[] = [];
      for (let p = 0; p < this.inputGoodsList.length; p++) {
        const product: GoodsModel = { Code: this.inputGoodsList[p].Code, WarehouseUnit: this.commonService.getObjectId(this.inputGoodsList[p].WarehouseUnit) };
        ids.push(product.Code);
        // product.Containers = product.Containers.filter(container => !choosedContainers.some(choosed => this.commonService.getObjectId(choosed) === this.commonService.getObjectId(container['Container'])));

        updateList.push(product);
      }
      this.apiService.putPromise<GoodsModel[]>('/warehouse/goods', { id: ids, revokeContainers: choosedContainers.map(container => this.commonService.getObjectId(container)).join(',') }, updateList).then(rs => {
        this.onDialogSave(rs);
        this.processing = false;
        this.close();
      });
    }
  }

  close() {
    this.ref.close();
  }

}
