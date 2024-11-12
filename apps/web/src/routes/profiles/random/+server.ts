import type { RequestHandler } from '@sveltejs/kit';
import data from '$lib/assets/eins.json';

type Ein = {
  _id: string;
};

const eins: Ein[] = data;

export const GET: RequestHandler = async () => {
  const { _id: randomEIN } = eins[Math.floor(Math.random() * eins.length)];

  return new Response(null, {
    status: 307,
    headers: {
      Location: `/profiles/v0/${randomEIN}`,
    },
  });
};
