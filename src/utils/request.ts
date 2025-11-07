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
      { extra: { disableAuth: true } }
    )
    .json();

  if (response.result === 'success') {
    Token.setAccessToken(response.data.access_token);
    Token.setRefreshToken(response.data.refresh_token);
  }
}
const authPlugin: HookFetchPlugin<unknown, { disableAuth: boolean }> = {
  name: 'auth',

  beforeRequest(ctx) {
    const headers = new Headers(ctx.headers);
    headers.set('Authorization', `Bearer ${Token.accessToken}`);
    return {
      ...ctx,
      headers,
    };
  },
  async onError(ctx, config) {
    const { status } = ctx;
    if (status === 401) {
      if(config?.extra?.disableAuth){
        emitter.emit('refresh_token_expired');
      } else {
        await refreshToken();
      }
      return ctx;
    }
    return ctx;
  },
  async afterResponse(ctx) {
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

const post = request.post;

const get = request.get;

const put = request.put;

const del = request.delete;

export { request, post, get, put, del };
