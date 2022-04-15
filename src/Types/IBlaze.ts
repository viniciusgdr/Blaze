import { EventEmitter } from "ws";
import { CrashUpdate, CrashUpdateV2, DoubleUpdate, DoubleUpdateV2 } from ".";

export declare type BlazeCrashEventMap = {
    'authenticated': {
        success: boolean;
        subscribe: string[]
    }
    'close': {
        code: number;
        reason: string;
    }
    /* 
     *   Message Players
     */
    'crash.bet': any;
    'crash.tick': CrashUpdateV2

    'crash.update': Partial<CrashUpdate | CrashUpdateV2>;
    'crash_waiting': CrashUpdate | CrashUpdateV2;
    'crash_graphing': CrashUpdate | CrashUpdateV2;
    'crash_complete': CrashUpdate | CrashUpdateV2;
}
export interface BlazeCrashEventEmitter extends EventEmitter {
    on<T extends keyof BlazeCrashEventMap>(event: T, listener: (arg: BlazeCrashEventMap[T]) => void): this;
    off<T extends keyof BlazeCrashEventMap>(event: T, listener: (arg: BlazeCrashEventMap[T]) => void): this;
    removeAllListeners<T extends keyof BlazeCrashEventMap>(event: T): this;
    emit<T extends keyof BlazeCrashEventMap>(event: T, arg: BlazeCrashEventMap[T]): boolean;
}

export declare type BlazeDoubleEventMap = {
    'authenticated': {
        success: boolean;
        subscribe: string[]
    }
    'close': {
        code: number;
        reason: string;
    }
    /* 
     *   Message Players
     */
    'doubles.bet': any;
    "double.tick": DoubleUpdateV2

    'doubles.update': Partial<DoubleUpdate | DoubleUpdateV2>;
    'roulette_waiting': DoubleUpdate | DoubleUpdateV2;
    'roulette_rolling': DoubleUpdate | DoubleUpdateV2;
    'roulette_complete': DoubleUpdate | DoubleUpdateV2;
}
export interface BlazeDoubleEventEmitter extends EventEmitter {
    on<T extends keyof BlazeDoubleEventMap>(event: T, listener: (arg: BlazeDoubleEventMap[T]) => void): this;
    off<T extends keyof BlazeDoubleEventMap>(event: T, listener: (arg: BlazeDoubleEventMap[T]) => void): this;
    removeAllListeners<T extends keyof BlazeDoubleEventMap>(event: T): this;
    emit<T extends keyof BlazeDoubleEventMap>(event: T, arg: BlazeDoubleEventMap[T]): boolean;
}
