import { User } from './user';
import { Action } from './action';

export class Message {
  index?: number;
  chatRoom?: string;
  namespace?: string;
  from?: User;
  content?: any;
  action?: Action;
  date?: string;
}
