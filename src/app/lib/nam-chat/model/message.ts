import { User } from './user';
import { Action } from './action';

export interface Message {
  index?: number;
  chatRoom: string;
  from?: User;
  content?: any;
  attachments?: MessageAttachment[];
  action?: Action;
  date?: string;
}

export interface MessageAttachment {
  type: string;
  payload: {
    thumbnail: string,
    url?: string,
  };
}
