import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgCurrencyCellRenderer } from "../cell/currency.component";
import { AgNumberCellRenderer } from "../cell/number.component";

export const agMakeNumberColDef = (
  cms: CommonService,
): ColDef => {
  return {
    width: 150,
    cellRenderer: AgNumberCellRenderer,
    filter: 'agNumberColumnFilter',
    // pinned: 'right',
    type: 'rightAligned',
    cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
  }
}