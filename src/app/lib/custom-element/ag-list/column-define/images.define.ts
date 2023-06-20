import { ColDef } from "@ag-grid-community/core";
import { CommonService } from "../../../../services/common.service";
import { AgTagsCellRenderer } from "../cell/tags/tags.component";
import { AgImageCellRenderer } from "../cell/image.component";
import { FileModel } from "../../../../models/file.model";
import { ImagesViewerComponent } from "../../my-components/images-viewer/images-viewer.component";
import { AgImagesCellRenderer } from "../cell/images.component";

export const agMakeImagesColDef = (
  cms: CommonService,
  click?: (image: any, rowData: any) => void,
  getImageList?: (rowData: any) => string[]
): ColDef => {

  return {
    headerName: 'Hình',
    // field: 'FeaturePicture',
    width: 100,
    filter: 'agTextColumnFilter',
    autoHeight: true,
    cellClass: ['ag-cell-image'],
    cellRenderer: AgImagesCellRenderer,
    cellRendererParams: {
      click: (image: FileModel, data) => {
        // console.log(image, data);
        click && click(image, data);
        cms.openDialog(ImagesViewerComponent, {
          context: {
            // images: (data.Pictures || []).map(m => m['LargeImage']),
            images: getImageList && getImageList(data) || [image.LargeImage || image],
            imageIndex: 0,
          },
          closeOnEsc: true,
        });
      }
    },
  };
};