import { Model } from "./model";

export class DeviceModel extends Model {
    Id?: string & number;
    Code?: string;
    Type?: string;
    Name?: string;
    Uuid?: string;
    RegisterId?: string;
    Staff?: string;
    Platform?: string;
    Version?: string;
    CurrentLatitude?: string;
    CurrentLongitude?: string;
    LastLocationUpdate?: string;
    IsLastLogin?: string | boolean;
    SenderIdentification?: string | number;
    Owner?: string;
    Mode?: string;
    BundleId?: string;
    ConfirmCode?: string;
    AppVersion?: string;
    RegistrationId?: string;
    DeviceId?: string;
}
