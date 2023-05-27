import { ColDef, GridApi, RowNode } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgButtonsCellRenderer } from "../cell/buttons.component";
import { AgGridDataManagerListComponent } from "../../../data-manager/ag-grid-data-manger-list.component";
import { DataManagerListComponent } from "../../../data-manager/data-manger-list.component";
import { AgCellButton } from "../cell/button.component";
import { AgCheckboxCellRenderer } from "../cell/checkbox.component";
import { ProductModel } from "../../../../models/product.model";

export const agMakeCheckboxColDef = <F, M>(
  listComponent: AgGridDataManagerListComponent<F, M>,
  cms: CommonService,
  onChange?: (params: any) => void
): ColDef => {
  return {
    // headerName: 'Import',
    // field: 'IsImport',
    width: 90,
    filter: 'agTextColumnFilter',
    // pinned: 'right',
    cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
    // headerClass: ['ag-cell-justify-end'],
    type: 'rightAligned',
    cellRenderer: AgCheckboxCellRenderer,
    cellRendererParams: {
      changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
        console.log(params);
        onChange && onChange(params)
      },
    },
    headerComponentParams: { enabledCheckbox: true }
  };
}