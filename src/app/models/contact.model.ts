export class ContactGroupModel {
  Code?: string;
  Name?: string;
  Descriptoin?: string;
}

export class ContactModel {

  Id?: string;
  Code?: string;
  Branch?: string;
  Type?: string;
  Group?: string;
  ParentIdBk?: string;
  Parent?: string;
  Name?: string;
  Title?: string;
  ShortName?: string;
  Address?: string;
  Address2?: string;
  Address3?: string;
  MapUrl?: string;
  TaxCode?: string;
  Email?: string;
  OtherEmail?: string;
  Phone?: string;
  OtherPhone?: string;
  Fax?: string;
  WorkTel?: string;
  HomeTel?: string;
  Website?: string;
  BankName?: string;
  BankAcc?: string;
  PersonalEmail?: string;
  CompanyEmail?: string;
  YahooId?: string;
  SkypeId?: string;
  MsnId?: string;
  GtalkId?: string;
  Note?: string;
  BranchId?: string;
  Creator?: string;
  Debt?: string;
  MaxDebt?: string;
  Keyword?: string;
  SearchRank?: string;
  State?: string;
  Birthday?: string;
  User?: string;
  CurrentDevice?: string;
  Sex?: string;
  Avatar?: string;
  Created?: string;
  WorkStatus?: string;
  PlaceOfBirth?: string;
  Homeland?: string;
  Religion?: string;
  EthnicOrigion?: string;
  SignsOwn?: string;
  PermanentAddress?: string;
  PlaceOfIssueIdNumber?: string;
  IdNumberSnapshot?: string;
  IdNumberSnapshot2?: string;
  CanLogin?: string;
  IdNumber?: string;
  DateOfIssueIdNumber?: string;
  JoinedDate?: string;
  Department?: string;
  SignatureSnapshot?: string;
  WorkingType?: string;
  Latitude?: string;
  Longitude?: string;
  Phone2?: string;
  Phone3?: string;
  Phone4?: string;
  PhoneExt?: string;
  Zalo?: string;
  WorkingState?: string;
  IsReceiveAllNotifications?: string;
  AvatarBk?: string;
  IdNumberSnapshotBk?: string;
  IdNumberSnapshot2Bk?: string;
  Location?: string;
  SipUser?: string;
  SipDomain?: string;
  SipPassword?: string;

  // References
  Organizations?: ContactModel[];
  Groups?: ContactGroupModel[];

  constructor() { }

}
