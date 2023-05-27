import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgButtonsCellRenderer } from "../cell/buttons.component";
import { AgCellButton } from "../cell/button.component";

export const agMakeButtonsColDef = (
  cms: CommonService,
  buttonsConfig: AgCellButton[]
): ColDef => {
  const config: ColDef = {
    headerName: 'Action',
    field: 'Command',
    width: 110,
    filter: false,
    sortable: false,
    pinned: 'right',
    type: 'rightAligned',
    cellClass: ['ag-cell-items-center', 'ag-cell-justify-center', 'ag-cell-no-padding-left', 'ag-cell-no-padding-right'],
    cellRenderer: AgButtonsCellRenderer,
    resizable: false,
    cellStyle: { 'text-overflow': 'initial' },
    cellRendererParams: {
      buttons: buttonsConfig,
    }
  };
  return config;
}