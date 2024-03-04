/* global Env */
export async function fetchR2Object(env: Env, key: string): Promise<Response> {
  const profile = await env.API_V1_POC0.get(key);

  if (!profile) {
    return new Response('Profile Not Found', { status: 404 });
  }

  return new Response(profile.body, {
    headers: { 'Content-Type': 'application/json' },
  });
}
