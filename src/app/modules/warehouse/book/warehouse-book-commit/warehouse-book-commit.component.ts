import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { FormControl } from '@angular/forms';
import { WarehouseGoodsContainerModel, GoodsModel, WarehouseBookModel } from '../../../../models/warehouse.model';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-warehouse-book-commit',
  templateUrl: './warehouse-book-commit.component.html',
  styleUrls: ['./warehouse-book-commit.component.scss'],
})
export class WarehouseBookCommitComponent extends BaseComponent implements OnInit {

  componentName: string = 'AssignContainerFormComponent';
  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputWarehouseBooks: WarehouseBookModel[];
  @Input() onDialogSave: (newData: WarehouseBookModel[]) => void;
  @Input() onDialogClose: () => void;

  formControl = new FormControl();

  goodsContainerList: (WarehouseGoodsContainerModel & { id?: string, text?: string })[] = [];
  select2OptionForGoodsContainers: Select2Option = {
    placeholder: this.cms.translateText('Warehouse.GoodsContainer.title', { action: this.cms.translateText('Common.choose'), definition: '' }),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    matcher: (term, text, option) => {
      return this.cms.smartFilter(text, term);
    },
    keyMap: {
      id: 'id',
      text: 'text',
    },
    multiple: true,
    // tags: true,
  };

  processing = false;

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<WarehouseBookCommitComponent>,
  ) {
    super(cms, router, apiService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  async init() {
    this.goodsContainerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true })).map(item => ({ id: item.Code, text: item.Path })).sort((a, b) => a.text.localeCompare(b.text));
    return super.init();
  }

  commit() {
    if (this.formControl.value) {
      this.processing = true;
      const ids = [];
      const updateList: GoodsModel[] = [];
      this.apiService.putPromise<WarehouseBookModel[]>('/warehouse/books', { id: this.inputWarehouseBooks.map(item => item.Code) }, this.inputWarehouseBooks.map(item => ({Code: item.Code, Commited: this.formControl.value}))).then(rs => {
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
