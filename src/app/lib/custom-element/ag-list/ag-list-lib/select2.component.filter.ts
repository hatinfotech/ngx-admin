import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams } from "@ag-grid-community/core";

import { Component } from "@angular/core";
import { IFilterAngularComp, IFloatingFilterAngularComp } from "@ag-grid-community/angular";
import { Select2Option } from "../../select2/select2.component";
import { FormControl } from "@angular/forms";
import { CommonService } from "../../../../services/common.service";
import { IFloatingFilterComp } from "ag-grid-community";

@Component({
    template: `
        <div style="max-width: 500px">
        <ngx-select2 [formControl]="inputControl" [select2Option]="params['select2Option']" [data]="data" (selectChange)="onFilterChanged($event)"></ngx-select2>
        </div>
    `
})
export class AgSelect2Filter implements IFilterAngularComp {
    inputControl = new FormControl();
    select2Option: Select2Option & { data?: () => any[] };
    logic: 'AND' | 'OR' = 'AND';
    data: any[] = [];
    condition = 'filter';

    public params!: any;

    constructor(
        public cms: CommonService,
    ) {

    }

    agInit(params: any): void {
        // if (params.filterChangedCallback) {
        this.params = params;
        // } else {
        //     this.params = params['filterParams'];
        // }
    }

    onFilterChanged($event: any) {
        this.params.filterChangedCallback();
    }

    getModel() {
        const filter = (this.inputControl.value || []).map(m => this.cms.getObjectId(m));
        return filter.length > 0 ? {
            filter: filter,
            filterType: 'text',
            type: 'equals',
        } : null;
    }

    setModel(model: any) {
        this.inputControl.setValue(model);
    }

    doesFilterPass(params: IDoesFilterPassParams) {
        // const rowSkills = params.data.skills;
        // let passed = true;

        // for (const skill of this.skills) {
        //     passed = passed && (skill.selected ? (skill.selected && rowSkills[skill.field]) : true);
        // }

        // return passed;
        return true;// dev for server data mode first
    };

    public isFilterActive() {
        return this.inputControl.value && this.inputControl.value.length > 0;
    };

    helloFromSkillsFilter() {
        alert("Hello From The Skills Filter!");
    }

    getModelAsString() {
        const filter = (this.inputControl.value || []).map(m => m.Name || this.cms.getObjectText(m));
        return filter.join(', ');
    }
}
