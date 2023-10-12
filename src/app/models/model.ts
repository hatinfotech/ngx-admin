import { ExecFileSyncOptionsWithBufferEncoding } from "child_process";

export class Model {
    [key: string]: any;
    id?: string;
    text?: string;
    RelativeVouchers?: { id: string, text: string, type: string }[];

    constructor(properties?: Model) {
        if (properties) {
            for (const name of Object.keys(properties)) {
                this[name] = properties[name];
            }
        }
    }

    static getInstance() {
        return new Model();
    }
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

export interface RegisterInfoModel {
    companyName?: string;
    companyTaxCode?: string;
    email?: string;
    tel?: string;
    address?: string;
    website?: string;
    domain?: string[];
    voucherInfo?: string;
    voucherLogo?: string;
    posBillLogo?: string;
    voucherLogoHeight?: number;
}

export interface SystemConfigModel {
    [key: string]: any;
    NOTIFICATION_ALLOW_TIME_RANGE: {
        from: string,
        to: string,
    };
    ROOT_CONFIGS: RootConfigModel;
    LICENSE_INFO: {
        register: RegisterInfoModel
    },
    PARAMETERS?: { [key: string]: any }

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

export interface AnyProps {
    [key: string]: any
}