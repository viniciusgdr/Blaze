import { BlazeCrashEventEmitter, BlazeDoubleEventEmitter } from ".";

export interface IBlazeCrashConnection {
    ev: BlazeCrashEventEmitter;
    closeSocket: () => void;
    sendToSocket: (data: any) => void;
}

export interface IBlazeDoubleConnection {
    ev: BlazeDoubleEventEmitter;
    closeSocket: () => void;
    sendToSocket: (data: any) => void;
}

export interface IMakeConnectionOptions {
    needCloseWithCompletedSession?: boolean;
    timeoutSendingAliveSocket?: number;
}