import { BlazeEventEmitter } from "./IBlaze";

export interface IBlazeConnection {
    ev: BlazeEventEmitter;
    closeSocket: () => void;
    sendToSocket: (data: any) => void;
}