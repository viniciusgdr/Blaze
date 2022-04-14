import { makeConnectionBlazeDoubles } from ".."

let socket = makeConnectionBlazeDoubles()
socket.ev.on('roulette_complete', msg => {
    console.log(msg)
})
