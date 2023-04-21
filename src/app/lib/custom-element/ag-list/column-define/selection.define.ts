import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";

export const agMakeSelectionColDef = (
  cms: CommonService,
): ColDef => {
  return {
    headerName: '#',
    field: 'Id',
    width: 80,
    valueGetter: 'node.data.Id',
    cellRenderer: 'loadingCellRenderer',
    sortable: false,
    filter: false,
    pinned: 'left',
    headerCheckboxSelection: true,
    checkboxSelection: true,
    showDisabledCheckboxes: true,
  }
}