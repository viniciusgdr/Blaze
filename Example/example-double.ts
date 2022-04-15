import { makeConnectionBlazeDoubles } from "../src"

let socket = makeConnectionBlazeDoubles({
    // optional params
    needCloseWithCompletedSession: true,
    timeoutSendingAliveSocket: 5000
})
socket.ev.on('roulette_complete', msg => {
    console.log(msg)
})
socket.ev.on('roulette_waiting', msg => {
    console.log(msg)
})
socket.ev.on('roulette_rolling', msg => {
    console.log(msg)
})
