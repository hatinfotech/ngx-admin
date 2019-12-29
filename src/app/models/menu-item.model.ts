import { PermissionModel } from './permission.model';

export class MenuItemModel {

  No?: string;
  Code?: string;
  Title: string;
  Icon?: string;
  Link?: string;
  Group?: boolean;
  Parent?: string;
  Children?: MenuItemModel[];
  Components?: { Id: number, Module: string, Component: string }[];
  Resources?: { Id: number, Module: string, Resource: string }[];
  Permissions?: PermissionModel[];

  constructor() { }

}

export class NgxMenuItemModel {

  title: string;
  icon?: string;
  link?: string;
  group?: boolean;
  children?: NgxMenuItemModel[];

}
