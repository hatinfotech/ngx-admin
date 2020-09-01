import { Select2Option } from '../select2/select2.component';
import { FormGroup } from '@angular/forms';

export interface ActionControl {
  type?: 'button' | 'text' | 'select2';
  name?: string;
  status?: string;
  label?: string;
  iconPack?: string;
  icon?: string;
  title: string;
  size: string;
  select2?: { data: any[], option: Select2Option };
  value?: () => string;
  disabled?: (option?: any) => boolean;
  hidden?: (option?: any) => boolean;
  click: (event?: any, option?: any) => void;
  change?: (event?: any, option?: any) => void;
  typing?: (event?: any, option?: any) => void;
}

export interface ActionControlListOption {
  formIndex: number;
  form: FormGroup;
  [key: string]: any;
}
