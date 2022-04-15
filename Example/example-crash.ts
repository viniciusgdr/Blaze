import { makeConnectionBlazeCrash } from ".."

let socket = makeConnectionBlazeCrash({
    needCloseWithCompletedSession: true
})
socket.ev.on('crash_complete', msg => {
    console.log(msg)
})
socket.ev.on('crash_waiting', msg => {
    console.log(msg)
})
socket.ev.on('crash_graphing', msg => {
    console.log(msg)
})