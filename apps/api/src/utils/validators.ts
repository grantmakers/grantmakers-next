/* global Env */
export const isGet = (request: Request): boolean => request.method === "GET";

export const hasValidKey = (request: Request, env: Env): boolean => {
  return request.headers.get("X-Custom-Auth-Key") === env.AUTH_PRIVATE_KEY;
};

export const isValidEin = (ein: string): boolean => {
  const isValidRegex = /^\d{9}$/.test(ein);
  return isValidRegex;
};
