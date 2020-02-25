import { UserAgent } from './user-agent';
import * as SIP from 'sip.js';

export class User {
  // id?: string;
  // name?: string;
  // phone?: string;
  // uri?: string;

  constructor(
    public id?: string,
    public name?: string,
    public phone?: string,
    public uri?: string,
    public domain?: string,
    public password?: string,
    public serviceUrl?: string,
  ) { }


}
