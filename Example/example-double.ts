import { makeConnectionBlazeDoubles } from ".."

let socket = makeConnectionBlazeDoubles({
    needCloseWithCompletedSession: true
})
socket.ev.on('roulette_complete', msg => {
    console.log(msg)
})
