
export class FileModel {
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
  DirPath?: string;
  requestCookieUrl?: string;
  Token?: string;
  RemoteToken?: string;

  constructor() { }

}
