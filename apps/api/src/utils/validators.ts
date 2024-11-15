/* global Env */
export const isGet = (request: Request): boolean => request.method === 'GET';

export const hasValidKey = (request: Request, env: Env): boolean => {
  return request.headers.get('X-Custom-Auth-Key') === env.AUTH_PRIVATE_KEY;
};
