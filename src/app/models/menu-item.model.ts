import { PermissionModel } from './permission.model';

export class MenuItemModel {

  Code?: string;
  Title: string;
  Icon?: string;
  Link?: string;
  Group?: boolean;
  Parent?: string;
  Childrend?: MenuItemModel[];
  Components?: {Id: number, Module: string, Component: string}[];
  Permissions?: PermissionModel[];

  constructor() { }

}
