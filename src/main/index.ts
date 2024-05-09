import { BlazeSocket } from '../data/usecases/blaze-socket'
import { NodeConnectionSocket } from '../infra/app/socket'

export interface ConnectionBlaze {
  web: 'blaze'
  type: 'crash' | 'doubles' | 'crash_2'
}
export type Connection = {
  url?: string
  type?: string
  token?: string
  options?: {
    host?: string
    origin?: string
    headers?: Record<string, string>
  }
  timeoutPing?: number
  cacheIgnoreRepeatedEvents?: boolean
} & (ConnectionBlaze)

export type ConnectionSocketResponses = BlazeSocket

export const makeConnection = async ({
  type,
  web,
  options,
  token,
  timeoutPing,
  url,
  cacheIgnoreRepeatedEvents = true
}: Connection): Promise<ConnectionSocketResponses> => {
  switch (web) {
    case 'blaze': {
      const socket = new NodeConnectionSocket()
      const blazeSocket = new BlazeSocket(socket, cacheIgnoreRepeatedEvents)
      await blazeSocket.connect({
        url: url ?? 'wss://api-v2.blaze1.space/replication/?EIO=3&transport=websocket',
        type,
        token,
        options: {
          headers: options?.headers ?? {
            Upgrade: 'websocket',
            'Sec-Webscoket-Extensions': 'permessage-defalte; client_max_window_bits',
            Pragma: 'no-cache',
            Connection: 'Upgrade',
            'Accept-Encoding': 'gzip, deflate, br',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
          },
          host: 'api-v2.blaze1.space',
          origin: 'https://api-v2.blaze1.space',
          ...options
        },
        timeoutPing
      })
      return blazeSocket
    }
    default:
      throw new Error('Missing web')
  }
}
