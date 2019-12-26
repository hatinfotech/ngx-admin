
export class PbxCdrModel {

  Id: string;
  Pbx: string;
  DomainUuid?: string;
  Extension: string;
  FromOrigin: string;
  CallerName: string;
  CallerNumber: string;
  CallerDestination: string;
  RecordingFile: string;
  Start: string;
  Tta: string;
  Duration: string;
  Direction: string;
  HangupCase: string;
  RecordingUrl?: string;

  constructor() { }

}
