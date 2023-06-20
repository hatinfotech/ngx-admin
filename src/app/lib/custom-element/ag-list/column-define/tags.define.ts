import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgTagsCellRenderer } from "../cell/tags/tags.component";

export const agMakeTagsColDef = (
  cms: CommonService,
  click: (data: any) => void,
): ColDef => {

  return {
    // headerName: 'Chứng từ liên quan',
    // field: 'RelativeVouchers',
    width: 350,
    filter: 'agTextColumnFilter',
    cellRenderer: AgTagsCellRenderer,
    cellRendererParams: {
      onInit: (params: any, component: AgTagsCellRenderer) => {
        params.tags = (params?.value || []).map(m => ({
          name: 'edit',
          ...m,
        }));
      },
      onClick:(tag: any) => {
        click && click(tag);
      }
    }
  };
};