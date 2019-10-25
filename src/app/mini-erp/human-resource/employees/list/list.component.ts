import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../../@core/data/smart-table';
import { Employee } from '../../../models/employee.model';
import { DataServiceService } from '../../../services/data-service.service';
import { ShowcaseDialogComponent } from '../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  employees$: Employee[];


  editing = {};
  rows = [];

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
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
    columns: {
      Code: {
        title: 'Code',
        type: 'number',
      },
      Name: {
        title: 'Name',
        type: 'string',
      },
      Phone: {
        title: 'Phone',
        type: 'string',
      },
      Email: {
        title: 'E-mail',
        type: 'string',
      },
      Address: {
        title: 'Address',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(private dataService: DataServiceService, private dialogService: NbDialogService) {}

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit() {
    return this.dataService.getEmployees(data => this.source.load(data), (error) => {
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Error',
          content: error.logs[0],
        },
      });
    });
  }

}
