import { ColumnApi, Column, RowNode, GridApi, ICellEditorParams, ColDef, ICellEditorComp, IAfterGuiAttachedParams } from '@ag-grid-community/all-modules';

export class AgSelectEditorComponent implements ICellEditorComp {

  eInput: any;

  constructor() {

  }

  getValue() {
    return this.eInput.value;
  }
  isPopup?(): boolean {
    return false;
  }
  isCancelBeforeStart?(): boolean {
    return false;
  }
  isCancelAfterEnd?(): boolean {
    return false;
  }
  focusIn?(): void {
    this.eInput.focus();
  }
  focusOut?(): void {
    this.eInput.blur();
  }
  getFrameworkComponentInstance?() {
    return this;
  }
  getGui(): HTMLElement {
    return this.eInput;
  }
  destroy?(): void {
    throw new Error('Method not implemented.');
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    this.eInput.focus();
    this.eInput.select();
  }
  init?(params: ICellEditorParams): void {
    this.eInput = document.createElement('input');
    this.eInput.value = params.value;
  }

}

export class AgSelectEditorParam implements ICellEditorParams {
  key: string;
  eventKey: string;
  value: any;
  keyPress: number;
  charPress: string;
  column: Column;
  colDef: ColDef;
  node: RowNode;
  data: any;
  rowIndex: number;
  api: GridApi;
  columnApi: ColumnApi;
  cellStartedEdit: boolean;
  context: any;
  $scope: any;
  onKeyDown: (event: KeyboardEvent) => void;
  stopEditing: (suppressNavigateAfterEdit?: boolean) => void;
  eGridCell: HTMLElement;
  parseValue: (value: any) => any;
  formatValue: (value: any) => any;


}
