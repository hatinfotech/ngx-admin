import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgCurrencyCellRenderer } from "../cell/currency.component";

export const agMakeCurrencyColDef = (
  cms: CommonService,
): ColDef => {
  return {
    width: 150,
    cellRenderer: AgCurrencyCellRenderer,
    filter: 'agNumberColumnFilter',
    // pinned: 'right',
    type: 'rightAligned',
    cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
  }
}