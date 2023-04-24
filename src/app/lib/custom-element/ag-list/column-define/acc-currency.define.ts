import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgAccCurrencyCellRenderer } from "../cell/acc-currency.component";

export const agMakeAccCurrencyColDef = (
  cms: CommonService,
): ColDef => {
  return {
    width: 150,
    cellRenderer: AgAccCurrencyCellRenderer,
    filter: 'agNumberColumnFilter',
    // pinned: 'right',
    type: 'rightAligned',
    cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
  }
}