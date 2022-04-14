import ws from 'ws';
import EventEmitter from 'events';
import { API_BLAZE, getString, IBlazeCrashConnection } from '..';

export function makeConnectionBlazeCrash(): IBlazeCrashConnection {
    const ev = new EventEmitter();
    let completed = false
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

    function onOpen() {
        wss.send('423["cmd",{"id":"subscribe","payload":{"room":"crash"}}]')
        wss.send('423["cmd",{"id":"subscribe","payload":{"room":"crash_v2"}}]')
        wss.send('423["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTM2NzE2NCwiYmxvY2tzIjpbXSwiaWF0IjoxNjQ2MTg3NTE5LCJleHAiOjE2NTEzNzE1MTl9.DG3sZ8AS7adC1uMlLrlbIKJah9wJj5cFGbJxpaJ2eZ0"}}]')
        wss.send('422["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTM2NzE2NCwiYmxvY2tzIjpbXSwiaWF0IjoxNjQ2MTg3NTE5LCJleHAiOjE2NTEzNzE1MTl9.DG3sZ8AS7adC1uMlLrlbIKJah9wJj5cFGbJxpaJ2eZ0"}}]')
        wss.send('420["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTM2NzE2NCwiYmxvY2tzIjpbXSwiaWF0IjoxNjQ2MTg3NTE5LCJleHAiOjE2NTEzNzE1MTl9.DG3sZ8AS7adC1uMlLrlbIKJah9wJj5cFGbJxpaJ2eZ0"}}]')
        ev.emit('authenticated', {
            success: true,
            subscribe: ["crash", "crash_v2"]
        })
    }
    function onClose(code: number, reason: Buffer) {
        if (!completed) {
            console.log("Starting new WebSocket")
            let v2 = makeConnectionBlazeCrash()
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
                let v3 = makeConnectionBlazeCrash()
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
                    let v4 = makeConnectionBlazeCrash()
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
                completed = true
                ev.emit('crash_complete', {
                    type: 'v1',
                    ...json
                })
                wss.close()
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
                completed = true
                ev.emit('crash_complete', {
                    type: 'v2',
                    ...json
                })
                wss.close()
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