import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Select2Option } from '../select2/select2.component';

export interface ActionControl {
  type?: 'button' | 'text' | 'select2';
  name?: string;
  status: string;
  label?: string;
  icon?: string;
  title: string;
  size: string;
  select2?: {data: any[], option: Select2Option};
  value?: () => string;
  disabled?: (option?: any) => boolean;
  hidden?: (option?: any) => boolean;
  click: (event?: any, option?: any) => void;
  change?: (event?: any, option?: any) => void;
  typing?: (event?: any, option?: any) => void;
}
