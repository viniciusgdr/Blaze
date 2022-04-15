import ws from 'ws';
import EventEmitter from 'events';
import { API_BLAZE, getString, IBlazeCrashConnection, IMakeConnectionOptions } from '..';

export function makeConnectionBlazeCrash({
    needCloseWithCompletedSession = false,
    timeoutSendingAliveSocket =  5000,
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODQ1NzgwNiwiYmxvY2tzIjpbXSwiaWF0IjoxNjUwMDUwMjkwLCJleHAiOjE2NTUyMzQyOTB9.x5tzGNmryxckvvOMvnEwKsw0r1R4us7w6NZRSiv-MA0'
}: IMakeConnectionOptions): IBlazeCrashConnection {
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
    wss.on('open', onOpen)
    wss.on('message', onMessageReceived)
    wss.on('close', onClose)

    let interval = setInterval(() => {
        wss.send('2')
    }, timeoutSendingAliveSocket)
    function onOpen() {
        wss.send('423["cmd",{"id":"subscribe","payload":{"room":"crash"}}]')
        wss.send('423["cmd",{"id":"subscribe","payload":{"room":"crash_v2"}}]')
        wss.send(`423["cmd",{"id":"authenticate","payload":{"token":"${token}"}}]`)
        wss.send(`422["cmd",{"id":"authenticate","payload":{"token":"${token}"}}]`)
        wss.send(`420["cmd",{"id":"authenticate","payload":{"token":"${token}"}}]`)
        ev.emit('authenticated', {
            success: true,
            subscribe: ["crash", "crash_v2"]
        })
    }
    function onClose(code: number, reason: Buffer) {
        ev.emit('close', {
            code, 
            reason: reason.toString()
        })
        clearInterval(interval)
        wss.close()
    }
    function onMessageReceived(data: ws.RawData) {
        let msg = data.toString();
        let id;
        try {
            id = getString(msg, '"id":"', '"', 0)
        } catch (err) {
            id = ''
        }
        if (id == 'crash.bet') {
            ev.emit('crash.bet', msg)
        }
        else if (id == 'crash.update') {
            let obj = getString(msg, '"payload":', '}', 0) + '}'
            let json = JSON.parse(obj)
            ev.emit('crash.update', json)
            if (json.status == 'waiting') {
                ev.emit('crash_waiting', {
                    type: 'v1',
                    ...json
                })
            }
            else if (json.status == 'graphing') {
                ev.emit('crash_graphing', {
                    type: 'v1',
                    ...json
                })
            }
            else if (json.status == 'complete') {
                ev.emit('crash_complete', {
                    type: 'v1',
                    ...json
                })
                if (needCloseWithCompletedSession) {
                    clearInterval(interval)
                    wss.close()
                }
            }
        } 
        else if (id == "crash.tick") {
            let obj = getString(msg, '"payload":', '}}', 0) + '}'
            let json = JSON.parse(obj)
            ev.emit('crash.tick', {
                type: 'v2',
                ...json
            })
            if (json.crash_point == null) {
                if (json.status == 'graphing') {
                    ev.emit('crash_graphing', {
                        type: 'v2',
                        ...json
                    })
                } else {
                    ev.emit('crash_waiting', {
                        type: 'v2',
                        ...json
                    })
                }
            } else {
                ev.emit('crash_complete', {
                    type: 'v2',
                    ...json
                })
                if (needCloseWithCompletedSession) {
                    clearInterval(interval)
                    wss.close()
                }
            }
        }
    }
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
};