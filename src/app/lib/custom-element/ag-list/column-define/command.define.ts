import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgButtonsCellRenderer } from "../cell/buttons.component";
import { AgGridDataManagerListComponent } from "../../../data-manager/ag-grid-data-manger-list.component";
import { DataManagerListComponent } from "../../../data-manager/data-manger-list.component";
import { AgCellButton } from "../cell/button.component";

export const agMakeCommandColDef = <F, M>(
  listComponent: AgGridDataManagerListComponent<F, M>,
  cms: CommonService,
  editAction?: ((data: any) => void) | boolean,
  deleteAction?: ((data: any) => void) | boolean,
  permissionAction?: ((data: any) => void) | boolean,
  extendActions?: AgCellButton[],
): ColDef => {
  const buttons = [];
  let width = 0;
  if (permissionAction) {
    buttons.push({
      name: 'permission',
      status: 'warning',
      icon: 'shield-outline',
      outline: false,
      action: (params: any, button: any) => {
        typeof permissionAction == 'function' ? permissionAction(params.node.data) : listComponent?.openPermissionForm(params.node.data);
      }
    });
    width += 40;
  }
  if (editAction) {
    buttons.push({
      name: 'edit',
      status: 'info',
      icon: 'edit-2-outline',
      outline: false,
      action: (params: any, button: any) => {
        typeof editAction == 'function' ? editAction(params.node.data) : listComponent?.openForm([listComponent.makeId(params.node.data)]);
      }
    });
    width += 40;
  }
  if (deleteAction) {
    buttons.push({
      name: 'delete',
      status: 'danger',
      icon: 'trash-2-outline',
      outline: false,
      action: (params: any, button: any) => {
        typeof deleteAction == 'function' ? deleteAction(params.node.data) : listComponent?.deleteConfirm([listComponent.makeId(params.node.data)]);
      }
    });
    width += 40;
  }
  if (extendActions) {
    for (const extendAction of extendActions) {
      if (extendAction.appendTo == 'head') {
        buttons.unshift(extendAction);
      } else {
        buttons.push(extendAction);
      }
      width += 40;
    }
  }
  const config: ColDef = {
    headerName: 'Sửa/Xóa',
    field: 'Command',
    maxWidth: width,
    filter: false,
    sortable: false,
    pinned: 'right',
    type: 'rightAligned',
    cellClass: ['ag-cell-items-center', 'ag-cell-justify-end', 'ag-cell-no-padding-left', 'ag-cell-no-padding-right'],
    cellRenderer: AgButtonsCellRenderer,
    resizable: false,
    cellStyle: { 'text-overflow': 'initial', 'border': 'none' },
    cellRendererParams: {
      buttons: buttons,
    }
  };
  return config;
}