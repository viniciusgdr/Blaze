
# Blaze - TS/JS Blaze API
A websocket connection for Blaze games
<img src="/Media/blaze.png" alt="Blaze"/>

## Example
You can check at [example.ts](https://github.com/viniciusgdr/Blaze/blob/master/Example/example.ts)
an event receiving usage model

To run the example, download or clone the repo and then type the following in terminal:
1. ``` cd path/Blaze ```
2. ``` npm i ```
3. ``` npm run example ``` 


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
'authenticated': { success: boolean; subscribe: string[] }
'close': { code: number; reason: string; }

'crash.tick': CrashUpdate | CrashUpdateV2;
'double.tick': DoubleUpdate | DoubleUpdateV2;

'crash_waiting': CrashUpdate | CrashUpdateV2 | DoubleUpdate | DoubleUpdateV2;
'crash_graphing': CrashUpdate | CrashUpdateV2 | DoubleUpdate | DoubleUpdateV2;
'crash_complete': CrashUpdate | CrashUpdateV2 | DoubleUpdate | DoubleUpdateV2;
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
You can end the connection when the action is complete:
```ts
const socket = makeConnectionBlaze({
    needCloseWithCompletedSession: boolean
})
```

You can set the interval time between sends that the socket is alive in blaze
```ts
const socket = makeConnectionBlaze({
    timeoutSendingAliveSocket: number
})
```

You can set the your token of blaze (Optional)
```ts
const socket = makeConnectionBlaze({
    token: string
})
```

You can enable event repeat mode
```ts
const socket = makeConnectionBlaze({
    requireNotRepeated: false
    // the default is true
})
```
## Licence

[MIT](https://choosealicense.com/licenses/mit/)

