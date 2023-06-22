import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgCurrencyCellRenderer } from "../cell/currency.component";
import { AgTextCellRenderer } from "../cell/text.component";

export const agMakeTextColDef = (
  cms?: CommonService,
): ColDef => {
  return {
    cellRenderer: AgTextCellRenderer,
    filter: 'agTextColumnFilter',
    cellClass: ['ag-cell-2line-wrap'],
    autoHeight: true,
  }
}