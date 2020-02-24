export interface ActionControl {
  type?: string;
  name?: string;
  status: string;
  label?: string;
  icon?: string;
  title: string;
  size: string;
  value?: () => string;
  disabled: (option?: any) => boolean;
  click: (event?: any, option?: any) => boolean;
  change?: (event?: any, option?: any) => false;
  typing?: (event?: any, option?: any) => false;
}
