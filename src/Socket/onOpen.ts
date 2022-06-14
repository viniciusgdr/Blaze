import WebSocket from "ws";
import EventEmitter from 'events';

export function onOpen(
    wss: WebSocket,
    ev: EventEmitter,
    token: string | undefined,
    type: 'crash' | 'doubles'
) {
    if (type == 'crash') {
        wss.send('423["cmd",{"id":"subscribe","payload":{"room":"crash"}}]')
        wss.send('423["cmd",{"id":"subscribe","payload":{"room":"crash_v2"}}]')
    }
    else if (type == 'doubles') {
        wss.send('423["cmd",{"id":"subscribe","payload":{"room":"double"}}]')
        wss.send('423["cmd",{"id":"subscribe","payload":{"room":"double_v2"}}]')
    }
    if (token) {
        wss.send(`423["cmd",{"id":"authenticate","payload":{"token":"${token}"}}]`)
        wss.send(`422["cmd",{"id":"authenticate","payload":{"token":"${token}"}}]`)
        wss.send(`420["cmd",{"id":"authenticate","payload":{"token":"${token}"}}]`)
    }
    ev.emit('authenticated', {
        success: true,
        subscribe: [
            type == 'crash' ? 'crash' : 'double',
            type == 'crash' ? 'crash_v2' : 'double_v2'
        ]
    })
}