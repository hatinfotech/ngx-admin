import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { CrawlPlanModel } from '../../../../models/crawl.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { CrawlPlanFormComponent } from '../crawl-plan-form/crawl-plan-form.component';

@Component({
  selector: 'ngx-crawl-plan-list',
  templateUrl: './crawl-plan-list.component.html',
  styleUrls: ['./crawl-plan-list.component.scss'],
})
export class CrawlPlanListComponent extends DataManagerListComponent<CrawlPlanModel> implements OnInit {

  componentName: string = 'CrawlPlanListComponent';
  formPath = '/crawl/plan/form';
  apiPath = '/crawl/plans';
  idKey = 'Code';
  // protected _http: HttpClient;

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected _http: HttpClient,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
  }

  editing = {};
  rows = [];

  settings = {
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 99999,
    },
    columns: {
      Code: {
        title: 'Code',
        type: 'string',
        width: '10%',
      },
      // Name: {
      //   title: 'Tên',
      //   type: 'string',
      //   width: '30%',
      // },
      Description: {
        title: 'Mô tả',
        type: 'string',
        width: '70%',
      },
      ApiVersion: {
        title: 'Api Version',
        type: 'string',
        width: '20%',
      },
      // Action: {
      //   title: 'Action',
      //   type: 'custom',
      //   width: '10%',
      //   renderComponent: SmartTableButtonComponent,
      //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
      //     instance.iconPack = 'eva';
      //     instance.icon = 'copy';
      //     instance.label = 'Copy nội dung sang site khác';
      //     instance.display = true;
      //     instance.status = 'success';
      //     instance.valueChange.subscribe(value => {
      //       // if (value) {
      //       //   instance.disabled = false;
      //       // } else {
      //       //   instance.disabled = true;
      //       // }
      //     });
      //     instance.click.subscribe(async (row: CrawlPlanModel) => {

      //       this.dialogService.open(SyncFormComponent, {
      //         context: {
      //           inputMode: 'dialog',
      //           inputId: [row.Code],
      //           onDialogSave: (newData: CrawlPlanModel[]) => {
      //             // if (onDialogSave) onDialogSave(row);
      //           },
      //           onDialogClose: () => {
      //             // if (onDialogClose) onDialogClose();
      //             this.refresh();
      //           },
      //         },
      //       });

      //     });
      //   },
      // },
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: CrawlPlanModel[]) => void) {
    super.getList((rs) => {
      // rs.map((i: any) => {
      //   i.Brandnames = i.Brandnames.map((i2: any) => i2.id).join(',');
      //   return i;
      // });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: CrawlPlanModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(CrawlPlanFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: CrawlPlanModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
      hasScroll: true,
      closeOnEsc: false,
      // closeOnBackdropClick: false,
    });
  }

  /** Go to form */
  gotoForm(id?: string): false {
    // this.router.navigate(id ? [this.formPath, id] : [this.formPath], { queryParams: { list: this.componentName } });
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

}
