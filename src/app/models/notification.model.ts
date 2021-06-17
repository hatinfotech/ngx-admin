export interface NotificationModel {
    Id?: number;
    TypeId?: string;
    Title?: string;
    Content?: string;
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
    Picture?: string,
}
