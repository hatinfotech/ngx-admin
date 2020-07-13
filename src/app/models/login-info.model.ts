import { UserModel } from './user.model';
import { ContactModel } from './contact.model';
import { FileStoreModel } from './file.model';
import { UserPhoneExtensionModel } from './user-phone-extension.model';

export class LoginInfoModel {

  user?: UserModel;
  contact?: ContactModel;
  distribution?: {fileStores: {[key: string]: FileStoreModel}, cookie: string};
  system?: {version?: string};
  phoneExtensions?: UserPhoneExtensionModel[];

  constructor() { }

}
