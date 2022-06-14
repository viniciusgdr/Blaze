import ws from 'ws';
import EventEmitter from 'events';
import { API_BLAZE, IBlazeConnection, IMakeConnectionOptions } from '..';
import { onOpen } from './onOpen';
import { onMessage } from './onMessage';

export function makeConnectionBlaze({
    needCloseWithCompletedSession = false,
    requireNotRepeated = true,
    timeoutSendingAliveSocket = 5000,
    token = undefined,
    type = 'crash'
}: IMakeConnectionOptions): IBlazeConnection {
    const ev = new EventEmitter();
    const wss = new ws(API_BLAZE, {
        origin: 'https://blaze.com',
        headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            'Pragma': 'no-cache',
            'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
            'Upgrade': 'websocket'
        }
    });
    let interval = setInterval(() => {
        wss.send('2')
    }, timeoutSendingAliveSocket)
    wss.on('open', () => {
        onOpen(wss, ev, token, type)
    });
    wss.on('message', (data: any) => {
        onMessage(data, wss, ev, requireNotRepeated, needCloseWithCompletedSession, interval)
    });
    wss.on('close', (code: number, reason: Buffer) => {
        ev.emit('close', {
            code,
            reason: reason.toString()
        })
        clearInterval(interval)
        wss.close()
    });
    return {
        ev: ev,
        closeSocket: () => {
            clearInterval(interval)
            wss.close()
        },
        sendToSocket: (data: any) => {
            wss.send(data, (error) => {
                if (error) throw error
            })
        }
    }
}