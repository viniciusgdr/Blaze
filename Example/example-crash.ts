import { makeConnectionBlazeCrash } from "../src"

let socket = makeConnectionBlazeCrash({
    // optional params
    needCloseWithCompletedSession: true,
    timeoutSendingAliveSocket: 5000
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