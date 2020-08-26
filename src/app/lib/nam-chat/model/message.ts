import { User } from './user';
import { Action } from './action';

export interface Message {
  index?: number;
  chatRoom: string;
  from?: User;
  content?: any;
  attachments?: {
    type: string,
    payload: {
      thumbnail: string;
      url?: string;
    },
  }[];
  action?: Action;
  date?: string;
}
