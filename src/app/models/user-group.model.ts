import { UserModel } from './user.model';

export class UserGroupModel {

  Code?: string;
  Name: string;
  Description?: string;
  Status?: string;
  Users?: UserModel[];
  id: string;

  constructor() { }

}
