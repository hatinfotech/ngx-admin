export interface ActionControl {
  name?: string;
  status: string;
  label?: string;
  icon: string;
  title: string;
  size: string;
  disabled: () => boolean;
  click: () => false;
}
