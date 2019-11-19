import { ModuleModel } from '../modules/module.model';
import { PermissionModel } from './permission.model';

export class UserModel {

  Code?: string;
  Name: string;
  Username: string;
  Password?: string;
  modulePermissions: {module: ModuleModel, permissions: PermissionModel[]}[];

  constructor() { }

}
