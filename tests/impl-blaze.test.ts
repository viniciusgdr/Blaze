import { BlazeSocket } from '../src/data/usecases/blaze-socket'
import { type ConnectionSocket } from '../src/domain/usecases/connectionSocket'

export const makeConnectionSocket = (): ConnectionSocket => {
  class ConnectionSocketStub implements ConnectionSocket {
    async connect (options: ConnectionSocket.Options): Promise<void> {
      await new Promise<void>(resolve => { resolve() })
    }

    on (event: string, callback: (data: any) => void): void {

    }

    emit (event: string, data: any): void {

    }

    send (data: any): void {

    }

    async disconnect (): Promise<void> {
      await new Promise<void>(resolve => { resolve() })
    }
  }
  return new ConnectionSocketStub()
}

interface SutTypes {
  sut: BlazeSocket
  connectionSocketStub: ConnectionSocket
}

const makeSut = (cacheIgnoreRepeatedEvents: boolean = true): SutTypes => {
  const connectionSocketStub = makeConnectionSocket()
  const sut = new BlazeSocket(connectionSocketStub, cacheIgnoreRepeatedEvents)
  return {
    sut,
    connectionSocketStub
  }
}

describe('Implementation test (Crash)', () => {
  test('should receive an action waiting (repeat)', async () => {
    const { sut } = makeSut()
    await sut.connect({})
    sut.on('crash.tick', (data) => {
      expect(data.status).toBe('waiting')
    })
    sut.emit('message', '42["data", {"payload": {"id": "1", "status": "waiting"}}]')
  })

  test('should receive an action waiting (not repeat)', async () => {
    const { sut } = makeSut()
    await sut.connect({})
    let count = 0
    sut.on('crash.tick', () => {
      count++
      expect(count).toBe(1)
    })
    sut.emit('message', '42["data", {"payload": {"id": "1", "status": "waiting"}}]')
    sut.emit('message', '42["data", {"payload": {"id": "1", "status": "waiting"}}]')
    sut.emit('message', '42["data", {"payload": {"id": "1", "status": "waiting"}}]')
  })
  test('should on close, emits event', async () => {
    const { sut } = makeSut()
    await sut.connect({})
    sut.on('close', (data) => {
      expect(data).toBe('error')
    })
    sut.emit('close', 'error')
  })
})
