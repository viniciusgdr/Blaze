import ws from 'ws';
import EventEmitter from 'events';
import { API_BLAZE, getString, IBlazeDoubleConnection, IMakeConnectionOptions } from '..';

export function makeConnectionBlazeDoubles({
    needCloseWithCompletedSession = false,
    timeoutSendingAliveSocket =  5000
}: IMakeConnectionOptions): IBlazeDoubleConnection {
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
        wss.send('423["cmd",{"id":"subscribe","payload":{"room":"double"}}]')
        wss.send('423["cmd",{"id":"subscribe","payload":{"room":"double_v2"}}]')
        wss.send('423["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTM2NzE2NCwiYmxvY2tzIjpbXSwiaWF0IjoxNjQ2MTg3NTE5LCJleHAiOjE2NTEzNzE1MTl9.DG3sZ8AS7adC1uMlLrlbIKJah9wJj5cFGbJxpaJ2eZ0"}}]')
        wss.send('422["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTM2NzE2NCwiYmxvY2tzIjpbXSwiaWF0IjoxNjQ2MTg3NTE5LCJleHAiOjE2NTEzNzE1MTl9.DG3sZ8AS7adC1uMlLrlbIKJah9wJj5cFGbJxpaJ2eZ0"}}]')
        wss.send('420["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTM2NzE2NCwiYmxvY2tzIjpbXSwiaWF0IjoxNjQ2MTg3NTE5LCJleHAiOjE2NTEzNzE1MTl9.DG3sZ8AS7adC1uMlLrlbIKJah9wJj5cFGbJxpaJ2eZ0"}}]')
        ev.emit('authenticated', {
            success: true,
            subscribe: ["double", "double_v2"]
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
        if (id == 'doubles.bet') {
            ev.emit('doubles.bet', msg)
        }
        else if (id == 'doubles.update') {
            let obj = getString(msg, '"payload":', '}', 0) + '}'
            let json = JSON.parse(obj)
            ev.emit('doubles.update', json)
            if (json.status == 'waiting') {
                ev.emit('roulette_waiting', {
                    type: 'v1',
                    ...json
                })
            }
            else if (json.status == 'graphing') {
                ev.emit('roulette_rolling', {
                    type: 'v1',
                    ...json
                })
            }
            else if (json.status == 'complete') {
                ev.emit('roulette_complete', {
                    type: 'v1',
                    ...json
                })
                if (needCloseWithCompletedSession) {
                    clearInterval(interval)
                    wss.close()
                }
            }
        } 
        else if (id == "double.tick") {
            let obj = getString(msg, '"payload":', ']}}', 0) + ']}'
            let json = JSON.parse(obj)
            ev.emit("double.tick", {
                type: 'v2',
                ...json
            })
            if (json.color == null && json.status != 'complete') {
                if (json.status == "rolling") {
                    ev.emit('roulette_rolling', {
                        type: 'v2',
                        ...json
                    })
                } else {
                    ev.emit('roulette_waiting', {
                        type: 'v2',
                        ...json
                    })
                }
            } else {
                ev.emit('roulette_complete', {
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
            wss.close()
        },
        sendToSocket: (data: any) => {
            wss.send(data, (error) => {
                if (error) throw error
            })
        }
    }
};