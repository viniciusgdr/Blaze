import EventEmitter from 'events'
import { type ConnectionSocket } from '../../domain/usecases/connectionSocket'
import { type Socket } from '../../domain/usecases/socket'
import { type BlazeEventMap } from '../interfaces/blaze'

export class BlazeSocket implements Socket<BlazeEventMap> {
  interval: NodeJS.Timeout | null = null
  private readonly ev: EventEmitter = new EventEmitter()
  private cache: Record<string, any> | null = null
  constructor (
    private readonly socket: ConnectionSocket,
    cacheIgnoreRepeatedEvents: boolean = true
  ) {
    if (cacheIgnoreRepeatedEvents) {
      this.cache = {}
    }
  }

  async connect (options: Socket.Options): Promise<void> {
    await this.socket.connect(options)
    this.initPing(options.timeoutPing ?? 10000)
    this.initOpen(options.type ?? 'crash', options.token)
    this.onMessage()
    this.initClose(options)
  }

  private initPing (timeoutPing: number): void {
    this.interval = setInterval(() => {
      this.socket.send('2')
    }, timeoutPing)
  }

  private onMessage (): void {
    this.socket.on('message', (data: any) => {
      const msg: string = data.toString()
      const regex = /^\d+\["data",\s*({.*})]$/

      const match = msg.match(regex)
      if (!match) {
        return
      }

      const { payload, id } = JSON.parse(match[1]) ?? {}
      if (!payload || !id || !payload.id || !payload.status) {
        return
      }
      if (this.cache !== null) {
        void this.ev.emit(`CB:${id as string}`, payload)

        const cache = this.cache[payload.id]
        console.log(cache, payload.id, payload.status)
        if ((cache && cache !== payload.status) || !cache) {
          void this.ev.emit(id, payload)
          this.cache[payload.id] = payload.status
          return
        }
        this.cache[payload.id] = payload.status
        return
      }
      void this.ev.emit(id, payload)
    })
  }

  private initClose (options: Socket.Options): void {
    this.socket.on('close', async (code: number) => {
      if (this.interval) {
        clearInterval(this.interval)
      }
      void this.socket.disconnect()
      if (options.reconnect) {
        await new Promise(resolve => setTimeout(resolve, 100))
        void this.connect(options)
      }
      void this.ev.emit('close', {
        code,
        reconnect: options.reconnect
      })
    })
  }

  private initOpen (type: string, token?: string): void {
    this.socket.on('open', () => {
      const subscriptions = []
      if (type === 'crash') {
        this.socket.send('420["cmd",{"id":"subscribe","payload":{"room":"crash_v2"}}]')
        subscriptions.push('crash_v2')
      } else if (type === 'doubles') {
        this.socket.send('423["cmd",{"id":"subscribe","payload":{"room":"double_v2"}}]')
        subscriptions.push('double_v2')
      } else if (type === 'crash_2') {
        this.socket.send('423["cmd",{"id":"subscribe","payload":{"room":"crash_room_1"}}]')
        subscriptions.push('crash_room_1')
      } else {
        throw new Error('Missing type of socket')
      }
      this.socket.send('421["cmd",{"id":"subscribe","payload":{"room":"chat_room_2"}}]')
      subscriptions.push('chat_room_2')
      if (token) {
        this.socket.send(`423["cmd",{"id":"authenticate","payload":{"token":"${token}"}}]`)
        this.socket.send(`422["cmd",{"id":"authenticate","payload":{"token":"${token}"}}]`)
        this.socket.send(`420["cmd",{"id":"authenticate","payload":{"token":"${token}"}}]`)
      }
      void this.ev.emit('subscriptions', subscriptions)
    })
  }

  on<T extends keyof BlazeEventMap>(event: T, callback: (data: BlazeEventMap[T]) => void): void {
    this.ev.on(event, callback)
  }

  emit (event: string, data: any): void {
    this.socket.emit(event, data)
  }

  async disconnect (): Promise<void> {
    await this.socket.disconnect()
  }

  async send (data: any): Promise<void> {
    this.socket.send(data)
  }
}
