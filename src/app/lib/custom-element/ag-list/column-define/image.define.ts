import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgTagsCellRenderer } from "../cell/tags.component";
import { AgImageCellRenderer } from "../cell/image.component";
import { FileModel } from "../../../../models/file.model";
import { ImagesViewerComponent } from "../../my-components/images-viewer/images-viewer.component";

export const agMakeImageColDef = (
  cms: CommonService,
  click?: (iamge: any, rowData: any) => void,
): ColDef => {

  return {
    headerName: 'Hình',
    field: 'FeaturePicture',
    width: 100,
    filter: 'agTextColumnFilter',
    autoHeight: true,
    cellClass: ['ag-cell-image'],
    cellRenderer: AgImageCellRenderer,
    cellRendererParams: {
      click: (image: FileModel, data) => {
        // console.log(image, data);
        click && click(image, data);
        cms.openDialog(ImagesViewerComponent, {
          context: {
            images: (data.Pictures || []).map(m => m['LargeImage']),
            imageIndex: 0,
          },
          closeOnEsc: true,
        });
      }
    },
  };
};