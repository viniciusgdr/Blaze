import { makeConnectionBlaze } from "../src"

let socket = makeConnectionBlaze({
    needCloseWithCompletedSession: false,
    type: 'crash', // or 'doubles'
    requireNotRepeated: true,
})
socket.ev.on('game_graphing', (msg) => {
    console.log(msg)
})
socket.ev.on('game_waiting', (msg) => {
    console.log(msg)
})
socket.ev.on('game_complete', (msg) => {
    console.log(msg)
})