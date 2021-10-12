export interface ProcessMap {
    state: string;
    label: string;
    status: string;
    outline?: boolean;
    iconPack?: string;
    icon?: string;
    nextState?: string;
    nextStateLabel?: string;
    confirmTitle?: string;
    confirmText?: string;
    responseTitle?: string;
    responseText?: string;
    nextStates?: ProcessMap[],
}