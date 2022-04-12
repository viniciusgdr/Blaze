import ws from "ws";
import { BlazeEventEmitter } from "../Types/IBlaze";
import { getString } from '../Utils/functions';

export function onMessageReceived(ev: BlazeEventEmitter, data: ws.RawData) {
    let msg = data.toString();
    let id;
    try {
        id = getString(msg, '"id":"', '"', 0)
    } catch (err) {
        id = ''
    }
    if (id == 'crash.bet') {
        ev.emit('crash.bet', msg)
        return false
    }
    else if (id == 'crash.update') {
        let obj = getString(msg, '"payload":', '}', 0) + '}'
        let json = JSON.parse(obj)
        ev.emit('crash.update', json)
        if (json.status == 'waiting') {
            ev.emit('crash_waiting', json)
            return false
        }
        else if (json.status == 'graphing') {
            ev.emit('crash_graphing', json)
            return false
        }
        else if (json.status == 'complete') {
            ev.emit('crash_complete', json)
            return true
        } 
    } 
    return false
}