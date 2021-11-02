export abstract class Model {
    [key: string]: any;
    id?: string;
    text?: string;
    RelativeVouchers?: { id: string, text: string, type: string }[];
}

export interface RootConfigModel {
    coreName: string;
    domain: string,
    sslEnabled: boolean,
    chatService: {
        port: number,
        protocol: string,
        host: string
    }
}

export interface SystemConfigModel {
    [key: string]: any;
    NOTIFICATION_ALLOW_TIME_RANGE: {
        from: string,
        to: string,
    };
    ROOT_CONFIGS: RootConfigModel;
}