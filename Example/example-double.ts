import { makeConnectionBlazeDoubles } from ".."

let socket = makeConnectionBlazeDoubles({
    needCloseWithCompletedSession: true
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
