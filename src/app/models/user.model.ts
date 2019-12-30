import { ModuleModel } from '../models/module.model';
import { PermissionModel } from './permission.model';

export class UserModel {

  Code?: string;
  Name: string;
  Phone?: string;
  Email?: string;
  Username: string;
  Password?: string;
  Avata?: string;
  Contact?: string;
  Avatar?: string;
  Groups?: string[];
  modulePermissions?: {module: ModuleModel, permissions: PermissionModel[]}[];

  constructor() { }

}
