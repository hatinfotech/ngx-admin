export interface ActionControl {
  type?: string;
  name?: string;
  status: string;
  label?: string;
  icon?: string;
  title: string;
  size: string;
  value?: () => string;
  disabled?: (option?: any) => boolean;
  hidden?: (option?: any) => boolean;
  click: (event?: any, option?: any) => void;
  change?: (event?: any, option?: any) => void;
  typing?: (event?: any, option?: any) => void;
}
