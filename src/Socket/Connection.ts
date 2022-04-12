import ws from 'ws';
import EventEmitter from 'events';
import { onMessageReceived } from './onMessageReceived';
import { onOpen } from './onOpen';
import { IBlazeConnection } from '../Types/IBlazeConnection';
import { API_BLAZE } from '../Defaults';

export function makeConnection(): IBlazeConnection {
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
    let completed = false

    wss.on('open', () => onOpen(wss))
    wss.on('close', onClose)
    wss.on('message', onMessage)

    function onMessage(data: ws.RawData) {
        let res = onMessageReceived(ev, data)
        if (res) {
            completed = true
            wss.close()
        }
    }
    function onClose(code: number, reason: Buffer) {
        ev.emit('closed', {
            code: code, 
            reason: reason,
            retry: true
        })
        if (!completed) {
            console.log("Starting new WebSocket")
            let v2 = makeConnection()
            v2.ev.on('crash_waiting', (data) => {
                ev.emit('crash_waiting', data)
            })
            v2.ev.on('crash_graphing', (data) => {
                ev.emit('crash_graphing', data)
            })
            v2.ev.on('crash_complete', (data) => {
                completed = true
                ev.emit('crash_complete', data)
            })
            if (!completed) {
                console.log("Starting new WebSocket V2")
                let v3 = makeConnection()
                v3.ev.on('crash_waiting', (data) => {
                    ev.emit('crash_waiting', data)
                })
                v3.ev.on('crash_graphing', (data) => {
                    ev.emit('crash_graphing', data)
                })
                v3.ev.on('crash_complete', (data) => {
                    completed = true
                    ev.emit('crash_complete', data)
                })
                if (!completed) {
                    console.log("Starting new WebSocket V3")
                    let v4 = makeConnection()
                    v4.ev.on('crash_waiting', (data) => {
                        ev.emit('crash_waiting', data)
                    })
                    v4.ev.on('crash_graphing', (data) => {
                        ev.emit('crash_graphing', data)
                    })
                    v4.ev.on('crash_complete', (data) => {
                        completed = true
                        ev.emit('crash_complete', data)
                    })
                }
            }
        }
        wss.close()
    }
    return {
        ev: ev,
        closeSocket: () => {
            wss.close()
        },
        sendToSocket: (data: any) => {
            wss.send(data, (error) => {
                if (error) console.log(error)
            })
        }
    }
};