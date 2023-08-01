import { ColDef } from "@ag-grid-community/core";
import { AgButtonCellRenderer } from "../cell/button.component";
import { CommonService } from "../../../../services/common.service";
import { AgSelect2Filter } from "../filter/select2.component.filter";

export const agMakeStateColDef = (
  cms: CommonService,
  processingMap: any,
  click?: (data: any) => void,
): ColDef => {

  return {
    // headerName: 'Trạng thái',
    // field: 'State',
    width: 155,
    pinned: 'right',
    type: 'rightAligned',
    cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
    cellRenderer: AgButtonCellRenderer,
    cellStyle: { 'text-overflow': 'initial', 'border': 'none' },
    cellRendererParams: {
      label: '...',
      onInit: (params: any, component: AgButtonCellRenderer) => {
        // console.log(component);
        const value = cms.getObjectId(params.value);
        if (value && processingMap[value]) {
          params.label = processingMap[value].label;
          params.status = processingMap[value].status;
          params.outline = processingMap[value].outline;
        }
      },
      onRefresh: (params: any, component: AgButtonCellRenderer) => {
        // console.log(params);
        params.label = params.value;
      },
      click: (params: any) => {
        if (click) {
          click(params.node.data);
        }
      }
    },
    filter: AgSelect2Filter,
    filterParams: {
      select2Option: {
        placeholder: 'Chọn...',
        allowClear: true,
        width: '100%',
        dropdownAutoWidth: true,
        minimumInputLength: 0,
        withThumbnail: false,
        multiple: true,
        keyMap: {
          id: 'id',
          text: 'text',
        },
        data: Object.keys(processingMap).map(m => ({
          id: m,
          text: cms.translateText(processingMap[m].label),
        })),
      }
    },
  };
};