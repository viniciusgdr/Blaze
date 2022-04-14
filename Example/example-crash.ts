import { makeConnectionBlazeCrash } from ".."

let socket = makeConnectionBlazeCrash({
    needCloseWithCompletedSession: true
})
socket.ev.on('crash_complete', msg => {
    console.log(msg)
})