import { ExecFileSyncOptionsWithBufferEncoding } from "child_process";

export abstract class Model {
    [key: string]: any;
    id?: string;
    text?: string;
    RelativeVouchers?: { id: string, text: string, type: string }[];
}

export interface RootConfigModel {
    coreName: string;
    coreEmbedId: string;
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
    LICENSE_INFO: {
        register: {
            companyName: string,
            companyTaxCode: string,
            email: string,
            tel: string,
            address: string,
            website: string,
            voucherInfo: string,
            voucherLogo: string,
            posBillLogo?: string,
            voucherLogoHeight: number,
        }
    },
}

export class MyObject {
    [key: string]: any,

    constructor(
        public id?: string,
        public text?: string,
        public type?: string) { }

    toString() {
        return this.text;
    }
}