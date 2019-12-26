import { ModuleModel } from './module.model';
import { PermissionModel } from './permission.model';
import { UserModel } from './user.model';
import { ContactModel } from './contact.model';

export class FileStoreModel {

  Code?: string;
  Protocol?: string;
  Host?: string;
  Port?: number;
  Path?: string;
  requestCookieUrl?: string;

  constructor() { }

}
