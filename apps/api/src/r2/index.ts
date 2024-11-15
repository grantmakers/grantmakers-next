/* global Env */
export async function fetchR2Object(env: Env, namespace: string, key: string): Promise<Response> {
  const namespacedKey = `${namespace}/${key}`;
  const object = await env.API_V1_POC0.get(namespacedKey);

  if (!object) {
    return new Response('Profile Not Found', { status: 404 });
  }

  return new Response(object.body, {
    headers: { 'Content-Type': 'application/json' },
  });
}
