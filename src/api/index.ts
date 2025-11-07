import { get } from "../utils/request"

export const sseDemo = async () => {
  return get('/api/v2/stream/recentchange')
}
