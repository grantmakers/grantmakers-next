/* global Env */
export async function fetchR2Object(env: Env, key: string): Promise<Response> {
  const profile = await env.STATIC_API_V1.get(key);

  if (!profile) {
    return new Response("Profile Not Found", { status: 404 });
  }

  return new Response(profile.body, {
    headers: { "Content-Type": "application/json" },
  });
}
