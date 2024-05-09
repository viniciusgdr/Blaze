export interface GenericSocket<T> {
  on: (event: keyof T, callback: (data: T[keyof T]) => void) => void
  emit: (event: string, data: any) => void
}

export interface Socket<T> extends GenericSocket<T> {
  connect: (options: Socket.Options) => Promise<void>
  send: (data: any) => void
  disconnect: () => Promise<void>
}

export declare interface SocketEvents {
  'subscriptions': string[]
  'close': {
    code: number
  }
}

export namespace Socket {
  export interface Options {
    url?: string
    type?: string
    token?: string
    reconnect?: boolean
    options?: {
      host?: string
      origin?: string
      headers?: Record<string, string>
    }
    timeoutPing?: number
  }
}
