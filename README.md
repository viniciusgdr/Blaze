
# Blaze - TS/JS Blaze API
A websocket connection for Blaze games
<img src="/media/blaze.png" alt="Blaze"/>

## Install

Stable version:
```
npm i @viniciusgdr/Blaze
```
Or use the edge version
```
  npm i github:viniciusgdr/Blaze
```
    
## Handling Events
```ts
'close': { code: number; reconnect: boolean; }

'crash.tick'
'double.tick'
'subscriptions': string[]

// On enabled cacheIgnoreRepeatedEvents, the event will be sent only once. If you want to receive the event repeatedly, you can use: (or disable the cacheIgnoreRepeatedEvents)
'CB:crash.tick'
'CB:double.tick'
```

Example:
```ts
const socket = makeConnectionBlaze({
    type: 'crash', // or 'doubles'
})
socket.ev.on('game_complete', (msg) => {
    console.log(msg)
})
```
## Notes
You can set the your token of blaze (Optional)
```ts
const socket = makeConnectionBlaze({
    token: string
})
```

This option declared as "true" limits you from repeating the same event several times in the round. so sending only once.
```ts
const socket = makeConnectionBlaze({
    cacheIgnoreRepeatedEvents: false
    // the default is true
})
```
## Licence

[MIT](https://choosealicense.com/licenses/mit/)

