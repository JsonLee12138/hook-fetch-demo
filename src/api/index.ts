import { get } from "../utils/request"

export const sseDemo = () => {
  return get('/api/v2/stream/recentchange')
}
