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
  select2?: { data?: any[], option?: Select2Option };
  value?: any;
  disabled?: (option?: any) => boolean;
  hidden?: (option?: any) => boolean;
  click: (event?: any, option?: ActionControlListOption, context?: any) => void;
  change?: (event?: any, option?: ActionControlListOption) => void;
  typing?: (event?: any, option?: ActionControlListOption) => void;
}

export interface ActionControlListOption {
  formIndex: number;
  form: FormGroup;
  index: number,
  [key: string]: any;
}
