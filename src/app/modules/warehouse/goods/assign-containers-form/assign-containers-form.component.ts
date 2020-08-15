import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { FormControl } from '@angular/forms';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { NbDialogRef } from '@nebular/theme';
import { ProductModel } from '../../../../models/product.model';
import { WarehouseGoodsContainerModel, GoodsModel } from '../../../../models/warehouse.model';

@Component({
  selector: 'ngx-assign-containers-form',
  templateUrl: './assign-containers-form.component.html',
  styleUrls: ['./assign-containers-form.component.scss'],
})
export class AssignContainerFormComponent extends BaseComponent implements OnInit {

  componentName: string = 'AssignContainerFormComponent';
  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputGoodsList: ProductModel[];
  @Input() onDialogSave: (newData: ProductModel[]) => void;
  @Input() onDialogClose: () => void;

  containersFormControl = new FormControl();

  goodsContainerList: (WarehouseGoodsContainerModel & { id?: string, text?: string })[] = [];
  select2OptionForGoodsContainers: Select2Option = {
    placeholder: this.commonService.translateText('Warehouse.GoodsContainer.title', { action: this.commonService.translateText('Common.choose'), definition: '' }),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    multiple: true,
    tags: true,
  };

  processing = false;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<AssignContainerFormComponent>,
  ) {
    super(commonService, router, apiService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  async init() {
    this.goodsContainerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true })).map(item => ({ id: item.Code, text: item.Path })).sort((a, b) => a.text.localeCompare(b.text));
    return super.init();
  }

  assignCategories() {
    const choosedContainers: (WarehouseGoodsContainerModel & { id?: string, text?: string })[] = this.containersFormControl.value;

    if (choosedContainers && choosedContainers.length > 0) {
      this.processing = true;
      const ids = [];
      const updateList: GoodsModel[] = [];
      for (let p = 0; p < this.inputGoodsList.length; p++) {
        const product: GoodsModel = { Code: this.inputGoodsList[p].Code, Containers: this.inputGoodsList[p].Containers, WarehouseUnit:  this.inputGoodsList[p].WarehouseUnit};
        ids.push(product.Code);
        for (let c = 0; c < choosedContainers.length; c++) {
          const choosed = choosedContainers[c];
          if (!product.Containers.some(cate => choosed['id'] === cate['id'])) {
            product.Containers.push({ Container: this.commonService.getObjectId(choosed), Goods: product.Code, Unit: this.commonService.getObjectId(product.WarehouseUnit) } as any);
          }
        }
        updateList.push(product);
      }
      this.apiService.putPromise<GoodsModel[]>('/warehouse/goods', { id: ids }, updateList).then(rs => {
        this.onDialogSave(rs);
        this.processing = false;
        this.close();
      });
    }
  }

  revokeCategories() {
    const choosedContainers: (WarehouseGoodsContainerModel & { id?: string, text?: string })[] = this.containersFormControl.value;
    if (choosedContainers && choosedContainers.length > 0) {
      this.processing = true;
      const ids = [];
      const updateList: GoodsModel[] = [];
      for (let p = 0; p < this.inputGoodsList.length; p++) {
        const product: GoodsModel = { Code: this.inputGoodsList[p].Code, Containers: this.inputGoodsList[p].Containers, WarehouseUnit: this.commonService.getObjectId(this.inputGoodsList[p].WarehouseUnit) };
        ids.push(product.Code);
        product.Containers = product.Containers.filter(container => !choosedContainers.some(choosed => this.commonService.getObjectId(choosed) === this.commonService.getObjectId(container['Container'])));

        updateList.push(product);
      }
      this.apiService.putPromise<GoodsModel[]>('/warehouse/goods', { id: ids }, updateList).then(rs => {
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
