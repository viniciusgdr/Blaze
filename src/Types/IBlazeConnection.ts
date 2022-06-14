import { BlazeEventEmitter } from ".";

export interface IBlazeConnection {
    ev: BlazeEventEmitter;
    closeSocket: () => void;
    sendToSocket: (data: any) => void;
}

export interface IMakeConnectionOptions {
    needCloseWithCompletedSession?: boolean;
    timeoutSendingAliveSocket?: number;
    token?: string;
    requireNotRepeated?: boolean;
    type: 'crash' | 'doubles';
}