import { makeConnectionBlazeCrash } from ".."

let socket = makeConnectionBlazeCrash()
socket.ev.on('crash_complete', msg => {
    console.log(msg)
})