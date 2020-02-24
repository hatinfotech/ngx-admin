export interface ActionControl {
  type?: string;
  name?: string;
  status: string;
  label?: string;
  icon?: string;
  title: string;
  size: string;
  value?: () => string;
  disabled: () => boolean;
  click: (event?: any, option?: any) => false;
  change?: (event?: any, option?: any) => false;
  typing?: (event?: any, option?: any) => false;
}
