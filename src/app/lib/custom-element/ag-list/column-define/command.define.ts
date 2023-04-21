import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgButtonsCellRenderer } from "../cell/buttons.component";

export const agMakeCommandColDef = (
    cms: CommonService,
    editAction: (data: any) => void,
    deleteActin: (data: any) => void,
): ColDef => {
    return {
        headerName: 'Sử/Xóa',
        field: 'Command',
        width: 110,
        filter: false,
        pinned: 'right',
        type: 'rightAligned',
        cellClass: ['ag-cell-items-center', 'ag-cell-justify-center', 'ag-cell-no-padding-left', 'ag-cell-no-padding-right'],
        cellRenderer: AgButtonsCellRenderer,
        resizable: false,
        cellStyle: { 'text-overflow': 'initial' },
        cellRendererParams: {
          buttons: [
            {
              name: 'edit',
              status: 'warning',
              icon: 'edit-2-outline',
              outline: false,
              action: (params: any, button: any) => {
                editAction(params.node.data);
              }
            },
            {
              name: 'delete',
              status: 'danger',
              icon: 'trash-2-outline',
              outline: false,
              action: (params: any, button: any) => {
                deleteActin(params.node.data);
              }
            },
          ],
        }
    }
}