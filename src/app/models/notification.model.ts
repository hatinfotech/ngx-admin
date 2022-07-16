export interface NotificationModel {
    Id?: number;
    Time?: number;
    TypeId?: string;
    Title?: string;
    Content?: string;
    Action?: string,
    Status?: string,
    Icon?: string;
    IconPack?: string;
    ActionLink?: string;
    ImageId?: string;
    State?: string;
    CreatorId?: string;
    Created?: string;
    Staff?: string;
    DateOfCreate?: string;
    Type?: string;
    Receivers?: string;
    Sender?: {id: string, text: string, avatar: string};
    Data?: any;
    Path?: string;
    Picture?: string,
}
