/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import { BlazeMessageSocket } from '../data/usecases/blaze-messages-socket'
import { BlazeSocket } from '../data/usecases/blaze-socket'
import { NodeConnectionSocket } from '../infra/app/socket'
import { getBlazeUrl } from '../infra/blaze/blaze-url'

export interface ConnectionBlaze {
  web: 'blaze' | 'blaze-chat'
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

export type ConnectionSocketResponses = BlazeSocket | BlazeMessageSocket

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
      const socketOptions = {
        url: url ?? getBlazeUrl('games'),
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
          origin: 'https://api-gaming.blaze.com',
          ...options
        },
        timeoutPing
      }
      const socket = new NodeConnectionSocket()
      const blazeSocket = new BlazeSocket(socket, cacheIgnoreRepeatedEvents)
      await blazeSocket.connect(socketOptions)
      return blazeSocket
    }
    case 'blaze-chat': {
      const socketOptions = {
        url: url ?? getBlazeUrl('general'),
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
          origin: 'https://api-gaming.blaze.com',
          ...options
        },
        timeoutPing
      }

      const socketForMessages = new NodeConnectionSocket()
      const blazeSocketForMessages = new BlazeMessageSocket(socketForMessages)
      await blazeSocketForMessages.connect(socketOptions)

      return blazeSocketForMessages
    }
    default:
      throw new Error('Missing web')
  }
}
