import { PermissionModel } from './permission.model';

export class ResourceModel {

  Id?: string;
  Name: string;
  Description?: string;
  Module?: string;
  Permissions?: PermissionModel[];

  constructor() { }

}
