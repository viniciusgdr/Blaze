import WebSocket from "ws";
import { getString } from "..";
import EventEmitter from 'events';

let temp = {
    isWaitingBefore: false,
    isGraphingBefore: false,
    isCompleteBefore: false
}

function updateTemp(update: 'waiting' | 'graphing' | 'complete') {
    if (update == 'waiting') {
        temp.isWaitingBefore = true
        temp.isGraphingBefore = false
        temp.isCompleteBefore = false
    } else if (update == 'graphing') {
        temp.isGraphingBefore = true
        temp.isWaitingBefore = false
        temp.isCompleteBefore = false
    } else if (update == 'complete') {
        temp.isCompleteBefore = true
        temp.isWaitingBefore = false
        temp.isGraphingBefore = false
    }
}
export function onMessage(
    data: any,
    wss: WebSocket,
    ev: EventEmitter,
    requireNotRepeated: boolean = true,
    needCloseWithCompletedSession: boolean = false,
    interval: NodeJS.Timer
) {
    let msg: string = data.toString();
    let id: string;
    try {
        id = getString(msg, '"id":"', '"', 0)
    } catch (err) {
        id = ''
    }
    if (id == "crash.tick" || id == "double.tick" || id == 'crash.update' || id == 'doubles.update') {
        let obj = msg.slice(2, msg.length)
        let { payload: json } = JSON.parse(obj)[1]
        ev.emit(id, {
            type: id.includes('update') ? 'v1' : 'v2',
            ...json
        })
        if (json.status == 'graphing' || json.status == "rolling") {
            if ((requireNotRepeated && !temp.isGraphingBefore) || !requireNotRepeated) ev.emit('game_graphing', {
                type: id.includes('update') ? 'v1' : 'v2',
                game: id.includes('crash') ? 'crash' : 'doubles',
                isRepeated: temp.isGraphingBefore,
                ...json
            })
            if (!temp.isGraphingBefore) updateTemp('graphing')
        } else if (json.status == 'waiting') {
            if ((requireNotRepeated && !temp.isWaitingBefore) || !requireNotRepeated) ev.emit('game_waiting', {
                type: id.includes('update') ? 'v1' : 'v2',
                game: id.includes('crash') ? 'crash' : 'doubles',
                isRepeated: temp.isWaitingBefore,
                ...json
            })
            if (!temp.isWaitingBefore) updateTemp('waiting')
        } else {
            if ((requireNotRepeated && !temp.isCompleteBefore) || !requireNotRepeated) ev.emit('game_complete', {
                type: id.includes('update') ? 'v1' : 'v2',
                game: id.includes('crash') ? 'crash' : 'doubles',
                isRepeated: temp.isCompleteBefore,
                ...json
            })
            if (!temp.isCompleteBefore) updateTemp('complete')
            if (needCloseWithCompletedSession) {
                clearInterval(interval)
                wss.close()
            }
        }
    }
}