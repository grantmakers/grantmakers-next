import type { RequestHandler } from '@sveltejs/kit';
import data from '@repo/shared/data/public/ein.json';

export const prerender = true;

type Data = number[];

const einArray: Data = data;

export const GET: RequestHandler = async () => {
  const randomEIN = einArray[Math.floor(Math.random() * einArray.length)].toString();

  return new Response(null, {
    status: 307,
    headers: {
      Location: `/profiles/v0/${randomEIN}`,
    },
  });
};
