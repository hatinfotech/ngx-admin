import { Model } from "./model";

export class FileModel extends Model {
  [key: string]: any;
  Id?: number;
  Name?: string;
  Description?: string;
  Extension?: string;
  Revision?: number;
  Created?: string;
  Updated?: string;
  ClassName?: string;
  Protected?: string;
  Owner?: string;
  Store?: string;
  Thumbnail?: string;
  DownloadLink?: string;
  OriginImage?: string;

  constructor(properties?: any) { super(properties); }
}

export class FileStoreModel {

  Id?: string;
  Code?: string;
  Type?: string;
  Name?: string;
  Protocol?: string;
  Host?: string;
  Port?: number;
  Path?: string;
  UploadToken?:string;
  DirPath?: string;
  requestCookieUrl?: string;
  Token?: string;
  RemoteToken?: string;

  constructor() { }

}


export interface ImageModel {
  Id?: string;
  Thumbnail?: string;
  SmallImage?: string;
  LargeImage?: string;
  OriginImage?: string;
  ClassName?: string;
  Created?: string;
  Description?: string;
  DownloadLink?: string;
  Extension?: string;
  Filename?: string;
  Name?: string;
  Owner?: string;
  Protected?: string;
  Revision?: string;
  Store?: string;
  Type?: string;
  Updated?: string;
}