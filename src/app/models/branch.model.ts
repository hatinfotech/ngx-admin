import { ModuleModel } from './module.model';
import { PermissionModel } from './permission.model';
import { UserPhoneExtensionModel } from './user-phone-extension.model';

export interface BranchModel {
  [key: string]: any;
  id?: string;
  text?: string;
  Code?: string;
  Name?: string;
  Description?: string;

}
