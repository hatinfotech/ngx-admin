import { UserModel } from './user.model';

export class ChatRoomModel {

  Id?: string;
  Code?: string;
  Description?: string;
  DateOfCreate?: string;
  Creator?: string;
  Extend?: string;
  Contact?: string;
  State?: string;
  LastMessage?: string;
  Type?: string;
  ReadCommit?: string;
  IsManualChangeTitle?: string;
  MasterUser?: string;
  NumOfMessage?: string;

}

export class ChatRoomMemberModel {
  [key: string]: any;
  Id?: string;
  ChatRoom?: string & ChatRoomModel;
  User?: string;
  State?: string;
  IsAllow?: string;
  IsSilent?: string;
  NumOfReadMessage?: string;
  NumOfMessage?: string;
  ReadCommit?: string;
  Permission?: string;

  Name?: string;
  Avatar?: string;
}
