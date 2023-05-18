import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgButtonsCellRenderer } from "../cell/buttons.component";

export const agMakeButtonsColDef = (
  cms: CommonService,
  buttonsConfig: { name: string, label?: string, status: string, outline?: boolean, icon?: string, disabled?: (data: any, params?: any) => boolean, action: (data: any, params?: any) => void }[]
): ColDef => {
  // const buttons = [];
  // for (const buttonConfig of buttonsConfig) {
  //   buttons.push({
  //     name: buttonConfig.name,
  //     status: buttonConfig.status || 'warning',
  //     icon: buttonConfig.icon || 'edit-2-outline',
  //     outline: typeof buttonConfig.outline == 'undefined' ? false : buttonConfig.outline,
  //     label: buttonConfig.label,
  //     // disabled: (data) => buttonConfig.disabled && buttonConfig.disabled(data) || false,
  //     action: (params: any, btnConfig: any) => {
  //       buttonConfig.click(params.node.data, params);
  //     }
  //   });
  // }
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