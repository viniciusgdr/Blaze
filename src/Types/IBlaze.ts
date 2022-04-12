import { EventEmitter } from "ws";
import { CrashUpdate } from ".";

export declare type BlazeEventMap = {
    'crash.bet': any;

    'crash.update': Partial<CrashUpdate>;
    'crash_waiting': CrashUpdate;
    'crash_graphing': CrashUpdate;
    'crash_complete': CrashUpdate;

    'closed': {
        code: number;
        reason: Buffer;
        retry: boolean;
    };
}
export interface BlazeEventEmitter extends EventEmitter {
    on<T extends keyof BlazeEventMap>(event: T, listener: (arg: BlazeEventMap[T]) => void): this;
    off<T extends keyof BlazeEventMap>(event: T, listener: (arg: BlazeEventMap[T]) => void): this;
    removeAllListeners<T extends keyof BlazeEventMap>(event: T): this;
    emit<T extends keyof BlazeEventMap>(event: T, arg: BlazeEventMap[T]): boolean;
}
