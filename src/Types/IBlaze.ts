import { EventEmitter } from "ws";
import { CrashUpdate, CrashUpdateV2, DoubleUpdate, DoubleUpdateV2 } from ".";

export declare type BlazeDoubleEventMap = {
    'authenticated': {
        success: boolean;
        subscribe: string[]
    }
    'close': {
        code: number;
        reason: string;
    }
    'crash.tick': CrashUpdate | CrashUpdateV2;
    'double.tick': DoubleUpdate | DoubleUpdateV2;

    'game_graphing': CrashUpdate | CrashUpdateV2 | DoubleUpdate | DoubleUpdateV2;
    'game_waiting': CrashUpdate | CrashUpdateV2 | DoubleUpdate | DoubleUpdateV2;
    'game_complete': CrashUpdate | CrashUpdateV2 | DoubleUpdate | DoubleUpdateV2;
}
export interface BlazeEventEmitter extends EventEmitter {
    on<T extends keyof BlazeDoubleEventMap>(event: T, listener: (arg: BlazeDoubleEventMap[T]) => void): this;
    off<T extends keyof BlazeDoubleEventMap>(event: T, listener: (arg: BlazeDoubleEventMap[T]) => void): this;
    removeAllListeners<T extends keyof BlazeDoubleEventMap>(event: T): this;
    emit<T extends keyof BlazeDoubleEventMap>(event: T, arg: BlazeDoubleEventMap[T]): boolean;
}
