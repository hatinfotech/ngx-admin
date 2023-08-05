import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../../../environments/environment';
import { AppModule } from '../../../../../../app.module';
import { DataManagerPrintComponent } from '../../../../../../lib/data-manager/data-manager-print.component';
import { ProcessMap } from '../../../../../../models/process-map.model';
import { ApiService } from '../../../../../../services/api.service';
import { CommonService } from '../../../../../../services/common.service';
import { Model } from '../../../../../../models/model';
import { CollaboratorKpiStrategyFormComponent } from '../../../kpi-strategy/kpi-strategy-form/kpi-strategy-form.component';
import { CollaboratorKpiStrategyListComponent } from '../../../kpi-strategy/kpi-strategy-list/kpi-strategy-list.component';

@Component({
  selector: 'ngx-collaborator-kpi-award-info',
  templateUrl: './kpi-award-info.component.html',
  styleUrls: ['./kpi-award-info.component.scss']
})
export class CollaboratorKpiAwardInfoComponent extends DataManagerPrintComponent<Model> implements OnInit, OnChanges, AfterViewInit {

  /** Component name */
  componentName = 'CollaboratorKpiAwardInfoComponent';
  // title: string = 'Xem trước chiến lược KPI';
  apiPath = '/collaborator/kpi-awards';
  // approvedConfirm?: boolean;
  env = environment;
  processMapList: ProcessMap[] = [];
  formDialog = CollaboratorKpiStrategyFormComponent;
  processingMap: any;

  @Input() isSimple = false;

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<CollaboratorKpiAwardInfoComponent>,
    private datePipe: DatePipe,
  ) {
    super(cms, router, apiService, ref);
    this.processingMap = {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'NOTJUSTAPPROVED',
        status: 'success',
        nextStates: [
          AppModule.notJustApprodedState
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState
        ],
      },
    };
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  // ngAfterViewInit() {
  //   console.log(123);
  //   super.ngAfterViewInit();
  // }

  ngOnChanges(changes: SimpleChanges) {

    // this.doSomething(changes.categoryId.currentValue);
    if (changes['data'] && !changes['data'].firstChange) {
      this.data = this.prepareData(this.data);
    }
    this.refresh();
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }
  async init() {
    const result = await super.init();
    // this.title = `PhieuChi_${this.identifier}` + (this.data.DateOfImplement ? ('_' + this.datePipe.transform(this.data.DateOfImplement, 'short')) : '');
    // for (const i in this.data) {
    //   const data = this.data[i];
    //   data['Total'] = 0;
    //   data['Title'] = this.renderTitle(data);
    //   for (const detail of data.Details) {
    //     data['Total'] += detail['Amount'] = parseFloat(detail['Amount'] as any);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.cashVoucher[data.State || ''];
    // }
    // this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: Model) {
    return `Chien_Luoc_KPI_${this.getIdentified(data).join('-')}` + (data.DateOfImplement ? ('_' + this.datePipe.transform(data.DateOfImplement, 'short')) : '');
  }

  close() {
    this.ref.close();
  }

  renderValue(value: any, type?: string) {
    let v = value;
    if (v && value['text']) {
      v = value['text'] || "";
    }
    if (type === 'html') {
      return v.replace(/\n/g, '<br>');
    }
    return v;
  }

  toMoney(detail: Model) {
    let toMoney = parseInt(detail['Amount'] as any);
    // const tax = detail['Tax'] as any;
    // if (tax) {
    //   toMoney += toMoney * tax.Tax / 100;
    // }
    return toMoney;
  }

  getTotal() {
    let total = 0;
    // const details = this.data.Details;
    // for (let i = 0; i < details.length; i++) {
    //   total += this.toMoney(details[i]);
    // }
    return total;
  }

  saveAndClose() {
    if (this.onSaveAndClose) {
      // this.onSaveAndClose(this.data.Code);
    }
    this.close();
    return false;
  }

  exportExcel(type: string) {
    this.close();
    return false;
  }

  get identifier() {
    // return this.data.Code;
    return '';
  }

  approve() {
    // if (this.data) {
    //   this.apiService.putPromise('/accounting/cash-vouchers', {id: [this.data.Code], approve: true}, [{Code: this.data.Code}]).then(rs => {
    //     if (this.onClose) {
    //       this.onClose(this.data.Code);
    //     }
    //     this.close();
    //   });
    // }
  }

  cancel() {
    // if (this.data) {
    //   this.apiService.putPromise('/accounting/cash-vouchers', {id: [this.data.Code], cancel: true}, [{Code: this.data.Code}]).then(rs => {
    //     if (this.onClose) {
    //       this.onClose(this.data.Code);
    //     }
    //     this.close();
    //   });
    // }
  }

  approvedConfirm(data: Model) {
    // if (['COMPLETE'].indexOf(data.State) > -1) {
    //   this.cms.showDiaplog(this.cms.translateText('Common.approved'), this.cms.translateText('Common.completedAlert', { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
    //     {
    //       label: this.cms.translateText('Common.close'),
    //       status: 'success',
    //       action: () => {
    //         this.onClose(data);
    //       },
    //     },
    //   ]);
    //   return;
    // }
    const params = { id: [data.Code] };
    const processMap = this.processingMap[data.State || ''];
    params['changeState'] = processMap?.nextState;
    // let confirmText = '';
    // let responseText = '';
    // switch (data.State) {
    //   case 'APPROVE':
    //     params['changeState'] = 'COMPLETE';
    //     confirmText = 'Common.completeConfirm';
    //     responseText = 'Common.completeSuccess';
    //     break;
    //   default:
    //     params['changeState'] = 'APPROVE';
    //     confirmText = 'Common.approvedConfirm';
    //     responseText = 'Common.approvedSuccess';
    //     break;
    // }

    this.cms.showDialog(this.cms.translateText('Common.confirm'), this.cms.translateText(processMap?.confirmText, { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), [
      {
        label: this.cms.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.cms.translateText(data.State == 'APPROVED' ? 'Common.complete' : 'Common.approve'),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<Model[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
            this.loading = false;
            this.onChange && this.onChange(data);
            this.onClose && this.onClose(data);
            this.close();
            this.cms.toastService.show(this.cms.translateText(processMap?.responseText, { object: this.cms.translateText('Purchase.PrucaseVoucher.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), this.cms.translateText(processMap?.responseTitle), {
              status: 'success',
            });
            // this.cms.showDiaplog(this.cms.translateText('Common.approved'), this.cms.translateText(responseText, { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
            //   {
            //     label: this.cms.translateText('Common.close'),
            //     status: 'success',
            //     action: () => {
            //     },
            //   },
            // ]);
          }).catch(err => {
            this.loading = false;
          });
        },
      },
    ]);
  }

  prepareData(data: Model[]) {
    for (const item of data) {
      if (item.Details) {
        for (const detail of item.Details) {
          detail.SumOfAwardAmount = 0;
          for (const cycle of detail['Cycles']) {
            // cycle.SumOfAwardAmount = 0;
            for (const contractDetail of cycle['Details']) {
              contractDetail.Strategy.LevelDistributedIndicator = CollaboratorKpiStrategyListComponent.indicatorList.find(f => f.id == this.cms.getObjectId(contractDetail.Strategy.LevelDistributedIndicator));
              contractDetail.Strategy.SumOfAwardAmount = 0;
              for (const strategyDetail of contractDetail.Strategy.Details) {
                strategyDetail.Type = CollaboratorKpiStrategyListComponent.groupTypeList.find(f => f.id == this.cms.getObjectId(strategyDetail.Type));
                contractDetail.Strategy.SumOfAwardAmount += parseFloat(strategyDetail.AwardAmount || 0);
                // cycle.SumOfAwardAmount += contractDetail.Strategy.SumOfAwardAmount;
                if (strategyDetail.Conditions) {
                  for (const condition of strategyDetail.Conditions) {
                    condition.Indicator = CollaboratorKpiStrategyListComponent.indicatorList.find(f => f.id == this.cms.getObjectId(condition.Indicator))
                    condition.Condition = CollaboratorKpiStrategyListComponent.conditionList.find(f => f.id == this.cms.getObjectId(condition.Condition))
                  }
                }
              }
              detail.SumOfAwardAmount+= contractDetail.Strategy.SumOfAwardAmount;
              // cycle.SumOfAwardAmount += contractDetail.Strategy.SumOfAwardAmount;
            }
          }
        }
      }
    }
    return data;
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<Model[]>(this.apiPath, {
      id: ids,
      includeContact: true,
      includeRelativeVouchers: true,
      includeDetails: true,
      includeProducts: true,
    }).then(data => {

      this.summaryCalculate(data);
      return data;
    });
  }

  getItemDescription(item: Model) {
    return item?.Description;
  }

  summaryCalculate(data: Model[]) {
    // for (const i in data) {
    //   const item = data[i];
    //   item['Total'] = 0;
    //   item['Title'] = this.renderTitle(item);

    //   const processMap = this.processingMap[item.State || ''];
    //   item.StateLabel = processMap?.label;

    //   for (const detail of item.Details) {
    //     item['Total'] += detail['Amount'] = parseFloat(detail['Amount'] as any);
    //   }
    //   this.processMapList[i] = this.processingMap[item.State || ''];
    // }
    return data;
  }

}
