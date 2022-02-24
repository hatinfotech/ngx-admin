import { WarehouseGoodsContainerFormComponent } from './../../goods-container/warehouse-goods-container-form/warehouse-goods-container-form.component';
import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
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
import { rejects } from 'assert';

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
    // matcher: (term, text, option) => {
    //   return this.commonService.smartFilter(text, term);
    // },
    keyMap: {
      id: 'id',
      text: 'text',
    },
    multiple: true,
    // tags: true,
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
    // this.goodsContainerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, limit: 'nolimit' })).map(item => ({ id: item.Code, text: item.Path })).sort((a, b) => a.text.localeCompare(b.text));
    this.goodsContainerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includeIdText: true, includeFindOrder: true, sort_Path: 'asc', limit: 'nolimit' }));
    return super.init();
  }

  async assignCategories() {
    let choosedContainers: (WarehouseGoodsContainerModel & { id?: string, text?: string })[] = this.containersFormControl.value;

    const ids = [];
    const updateList: GoodsModel[] = [];
    for (let p = 0; p < this.inputGoodsList.length; p++) {
      const product: GoodsModel = { Code: this.inputGoodsList[p].Code, WarehouseUnit: this.commonService.getObjectId(this.inputGoodsList[p].WarehouseUnit) };
      ids.push(product.Code);
      updateList.push(product);
    }
    if (!choosedContainers || choosedContainers.length == 0) {
      choosedContainers = await (async () => {
        return new Promise<WarehouseGoodsContainerModel[]>((resolve, reject) => {
          this.commonService.openDialog(ShowcaseDialogComponent, {
            context: {
              title: 'Tạo mới vị trí hàng hóa',
              content: 'Bạn có muốn tạo mới vị trí hàng hóa không?',
              actions: [
                {
                  label: 'Trở về',
                  status: 'basic',
                  action: () => {
                    reject('Không tạo vị trí hàng hóa');
                  },
                },
                {
                  label: 'Tạo và gán',
                  status: 'primary',
                  action: () => {
                    this.commonService.openDialog(WarehouseGoodsContainerFormComponent, {
                      context: {
                        inputMode: 'dialog',
                        // inputGoodsList: [editedItems],
                        onDialogSave: (newData: WarehouseGoodsContainerModel[]) => {
                          // this.refresh();
                          // this.updateGridItems(editedItems, newData);
                          resolve(newData.map(m => ({ id: m.Code, text: m.Name })));
                        },
                        onDialogClose: () => {
                        },
                      },
                      closeOnEsc: false,
                      closeOnBackdropClick: false,
                    });
                  },
                },
              ],
            }
          });
        });
      })();
    }

    if (choosedContainers && choosedContainers.length > 0) {
      this.processing = true;
      this.commonService.openDialog(ShowcaseDialogComponent, {
        context: {
          actions: [
            {
              label: 'Trở về',
              status: 'basic',
              action: () => {
              },
            },
            {
              label: 'Gán',
              status: 'primary',
              action: () => {
                this.apiService.putPromise<GoodsModel[]>('/warehouse/goods', { id: ids, assignContainers: choosedContainers.map(container => this.commonService.getObjectId(container)).join(',') }, updateList).then(rs => {
                  this.onDialogSave(rs);
                  this.processing = false;
                  this.close();
                });
              },
            },
            {
              label: 'Gán và cập nhật mô tả cho vị trí',
              status: 'danger',
              action: () => {
                this.apiService.putPromise<GoodsModel[]>('/warehouse/goods', { id: ids, updateContainerDescription: true, assignContainers: choosedContainers.map(container => this.commonService.getObjectId(container)).join(',') }, updateList).then(rs => {
                  this.onDialogSave(rs);
                  this.processing = false;
                  this.close();
                });
              },
            },
          ],
        }
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
