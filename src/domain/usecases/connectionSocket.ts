export interface ConnectionSocket {
  connect: (options: ConnectionSocket.Options) => Promise<void>
  on: (event: string, callback: (data: any) => void) => void
  emit: (event: string, data: any) => void
  send: (data: any) => void
  disconnect: () => Promise<void>
}

export namespace ConnectionSocket {
  export interface Options {
    url?: string
    options?: {
      host?: string
      origin?: string
      headers?: Record<string, string>
    }
  }
}
