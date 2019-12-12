import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../showcase-dialog/showcase-dialog.component';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {


  @Input() title: string;
  @Input() controls: {
    name: string,
    type?: string,
    dataList?: { id: string, text: string }[],
    label: string,
    placeholder: string,
  }[];
  @Input() actions: { label: string, icon?: string, status?: string, action?: (form: FormGroup) => void }[];

  formGroup: FormGroup;

  constructor(protected ref: NbDialogRef<ShowcaseDialogComponent>) {

    this.formGroup = new FormGroup({});

    if (this.actions) {
      this.actions.forEach(element => {
        if (!element.action) {
          element.action = () => {

          };
        }
        if (!element.status) {
          element.status = 'info';
        }
      });
    }
  }

  ngOnInit(): void {
    const fcs: { [key: string]: AbstractControl } = {};
    this.controls.forEach(control => {
      fcs[control.name] = new FormControl();
    });
    this.formGroup = new FormGroup(fcs);
  }

  dismiss() {
    this.ref.close();
  }
}
