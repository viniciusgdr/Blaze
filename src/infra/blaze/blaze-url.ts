export const getBlazeUrl = (type: 'games' | 'general'): string => {
  switch (type) {
    case 'games':
      return 'wss://api-gaming.blaze.com/replication/?EIO=3&transport=websocket'
    case 'general':
      return 'wss://api-v2.blaze.com/replication/?EIO=3&transport=websocket'
  }
}
