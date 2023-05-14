import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgButtonsCellRenderer } from "../cell/buttons.component";

export const agMakeCommandColDef = (
  cms: CommonService,
  editAction?: (data: any) => void,
  deleteActin?: (data: any) => void,
): ColDef => {
  const buttons = [];
  if (editAction) {
    buttons.push({
      name: 'edit',
      status: 'warning',
      icon: 'edit-2-outline',
      outline: false,
      action: (params: any, button: any) => {
        editAction(params.node.data);
      }
    });
  }
  if (deleteActin) {
    buttons.push({
      name: 'delete',
      status: 'danger',
      icon: 'trash-2-outline',
      outline: false,
      action: (params: any, button: any) => {
        deleteActin(params.node.data);
      }
    });
  }
  const config: ColDef = {
    headerName: 'Sửa/Xóa',
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
      buttons: buttons,
    }
  };
  return config;
}