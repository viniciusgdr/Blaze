import ws from "ws"

export function onOpen(wss: ws) {
    wss.send('423["cmd",{"id":"subscribe","payload":{"room":"crash"}}]')
    wss.send('423["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTM2NzE2NCwiYmxvY2tzIjpbXSwiaWF0IjoxNjQ2MTg3NTE5LCJleHAiOjE2NTEzNzE1MTl9.DG3sZ8AS7adC1uMlLrlbIKJah9wJj5cFGbJxpaJ2eZ0"}}]')
    wss.send('422["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTM2NzE2NCwiYmxvY2tzIjpbXSwiaWF0IjoxNjQ2MTg3NTE5LCJleHAiOjE2NTEzNzE1MTl9.DG3sZ8AS7adC1uMlLrlbIKJah9wJj5cFGbJxpaJ2eZ0"}}]')
    wss.send('420["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTM2NzE2NCwiYmxvY2tzIjpbXSwiaWF0IjoxNjQ2MTg3NTE5LCJleHAiOjE2NTEzNzE1MTl9.DG3sZ8AS7adC1uMlLrlbIKJah9wJj5cFGbJxpaJ2eZ0"}}]')
}