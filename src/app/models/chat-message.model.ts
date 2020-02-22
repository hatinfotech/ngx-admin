import { User } from '../@core/data/users';
export enum Action {
  JOINED,
  LEFT,
  RENAME,
}
export enum Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
}

export class ChatMessageModel {

  Id?: string;
  ChatRoom?: string;
  No?: string;
  Text?: string;
  User?: string;
  DateOfPost?: string;
  State?: string;
  Type?: string;
  Photo?: string;
  ExtendData?: string;
  PublicIp?: string;
  Latitude?: string;
  Longitude?: string;
  InOrganization?: string;
  ReplyForChatRoom?: string;
  ReplyForNo?: string;
  ReplyQuote?: string;
  ReferenceChatRoom?: string;
  OriginChatRoom?: string;
  OriginMessageNo?: string;

  // Extend
  index?: number;
  chatRoom?: string;
  from?: User;
  content?: any;
  action?: Action;

}
