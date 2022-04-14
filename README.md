
# Blaze - TS/JS Blaze API
A websocket connection for Blaze games
![Blaze.png](https://raw.githubusercontent.com/viniciusgdr/Blaze/master/blaze.png)

## Example
You can check at [example-crash.ts](https://github.com/viniciusgdr/Blaze/blob/b2f9ddc4c3aea60d7a5c52134359e0a587bb4a4f/Example/example-crash.ts)
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
Crash:
```ts
'authenticated': { success: boolean; subscribe: string[] }
'crash.bet': any;
'crash.tick': CrashUpdateV2

'crash.update': Partial<CrashUpdate | CrashUpdateV2>;
'crash_waiting': CrashUpdate | CrashUpdateV2;
'crash_graphing': CrashUpdate | CrashUpdateV2;
'crash_complete': CrashUpdate | CrashUpdateV2;
```
Doubles:
```ts
'authenticated': { success: boolean; subscribe: string[] }
'doubles.bet': any;
"double.tick": DoubleUpdateV2

'doubles.update': Partial<DoubleUpdate | DoubleUpdateV2>;
'roulette_waiting': DoubleUpdate | DoubleUpdateV2;
'roulette_rolling': DoubleUpdate | DoubleUpdateV2;
'roulette_complete': DoubleUpdate | DoubleUpdateV2;
```
Example:
```ts
const socket = makeConnectionBlazeCrash({})
socket.ev.on('crash_complete', msg => {
    console.log(msg)
})
```
## Notes
You can end the connection when the action is complete:
```ts
const socket = makeConnectionBlazeCrash({
     needCloseWithCompletedSession: boolean
})
```
## Licence

[MIT](https://choosealicense.com/licenses/mit/)

