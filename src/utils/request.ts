import type { HookFetchPlugin } from 'hook-fetch';
import hookFetch, { ContentType } from 'hook-fetch';
import { sseTextDecoderPlugin } from 'hook-fetch/plugins';
import { emitter } from './event';
import { Token } from './token';

const request = hookFetch.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': ContentType.JSON,
  },
  withCredentials: true,
});

async function refreshToken() {
  const response = await request
    .post(
      '/refresh-token',
      {
        refresh_token: Token.refreshToken,
      },
      { extra: { isRefreshToken: true } }
    )
    .json();

  if (response.result === 'success') {
    Token.setAccessToken(response.data.access_token);
    Token.setRefreshToken(response.data.refresh_token);
  }
}
const authPlugin: HookFetchPlugin = {
  name: 'auth',

  beforeRequest(ctx) {
    const headers = new Headers(ctx.headers);
    headers.set('Authorization', `Bearer ${Token.accessToken}`);
    return {
      ...ctx,
      headers,
    };
  },
  async onError(ctx) {
    const { status } = ctx;
    if (status === 401) {
      if ((ctx.config?.extra as { isRefreshToken: boolean })?.isRefreshToken) {
        emitter.emit('refresh_token_expired');
      } else {
        await refreshToken();
      }
      return ctx;
    }
    return ctx;
  },
  async afterResponse(ctx) {
    // const { status } = ctx.response;
    // if (status === 401) {
    //   if (ctx.config.url.includes('/refresh-token')) {
    //     emitter.emit('refresh_token_expired');
    //   }
    //   else {
    //     await refreshToken();
    //   }
    //   throw new Error('Unauthorized');
    // }
    return ctx;
  },
};

request.use(
  sseTextDecoderPlugin({
    json: true,
    prefix: 'data:',
  })
);
request.use(authPlugin as HookFetchPlugin);

export const post = request.post;

export const get = request.get;

export const put = request.put;

export const del = request.delete;

export { request };
// curl --location 'http://difyplus.innerfireai.com:30080/v1/chat-messages' \
// --header 'Authorization: Bearer app-WUBghZNBevDaUBUeZcBqMAo2' \
// --header 'Content-Type: application/json' \
// --data '{
//     "inputs": {},
//     "query": "{\"context\": {\"action\": \"start_practice\"}, \"chat_history\": []}",
//     "response_mode": "blocking",
//     "conversation_id": "",
//     "user": "f494e972-d0ae-4ba9-b57c-5ff7a31643ae"
// }'
