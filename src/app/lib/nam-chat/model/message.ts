import { User } from './user';
import { Action } from './action';

export interface Message {
  index?: number;
  chatRoom: string;
  from?: User;
  content?: any;
  action?: Action;
  date?: string;
}
