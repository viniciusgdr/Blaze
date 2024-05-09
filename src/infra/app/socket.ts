import { type ConnectionSocket } from '../../domain/usecases/connectionSocket'
import WebSocket from 'ws'

export class NodeConnectionSocket implements ConnectionSocket {
  private socket: WebSocket | null = null

  async connect (options: ConnectionSocket.Options): Promise<void> {
    if (!options.url) {
      throw new Error('Missing url')
    }
    this.socket = new WebSocket(options.url, options.options)
  }

  async on (event: string, callback: (data: any) => void): Promise<void> {
    if (!this.socket) {
      throw new Error('Missing socket')
    }
    this.socket.on(event, callback)
  }

  async emit (event: string, data: any): Promise<void> {
    if (!this.socket) {
      throw new Error('Missing socket')
    }
    this.socket.emit(event, data)
  }

  async disconnect (): Promise<void> {
    if (!this.socket) {
      throw new Error('Missing socket')
    }
    this.socket.close()
  }

  async send (data: any): Promise<void> {
    if (!this.socket) {
      throw new Error('Missing socket')
    }
    this.socket.send(data)
  }
}
