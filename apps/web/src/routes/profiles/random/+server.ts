import type { RequestHandler } from '@sveltejs/kit';
import data from '@repo/shared/data/public/ein.json';

export const prerender = true;

type Data = {
  ein: string;
};

const eins: Data[] = data;

export const GET: RequestHandler = async () => {
  const { ein: randomEIN } = eins[Math.floor(Math.random() * eins.length)];

  return new Response(null, {
    status: 307,
    headers: {
      Location: `/profiles/v0/${randomEIN}`,
    },
  });
};
